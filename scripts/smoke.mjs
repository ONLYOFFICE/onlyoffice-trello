#!/usr/bin/env node
/*
 * Deployment smoke test for ONLYOFFICE Power-Up for Trello.
 *
 * Checks that client, server, proxy (and optionally a Document Server) are up
 * and answer the way the Power-Up expects. It needs no Trello account and no
 * secrets, so it can run against any environment, including production.
 *
 * Usage (Node 18+):
 *   SMOKE_CLIENT_URL=https://client.example.com \
 *   SMOKE_SERVER_URL=https://server.example.com \
 *   SMOKE_PROXY_URL=https://proxy.example.com \
 *   SMOKE_DS_URL=https://docs.example.com/ \
 *   node scripts/smoke.mjs
 *
 * Any URL that is not set is skipped. Exit code is 1 if any check fails.
 *
 * Interactive scenarios (opening, co-editing and saving a document inside
 * Trello) cannot be automated here; see the manual checklist in HANDOVER.md.
 */

const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 8000);
const LOCALES = ['en-US', 'en-UK', 'de', 'es', 'fr', 'it', 'pt-BR', 'ru', 'zh-Hans'];
const TRELLO_ORIGIN = 'https://trello.com';

const trim = (url) => (url ? url.replace(/\/+$/, '') : '');
const targets = {
  client: trim(process.env.SMOKE_CLIENT_URL),
  server: trim(process.env.SMOKE_SERVER_URL),
  proxy: trim(process.env.SMOKE_PROXY_URL),
  ds: trim(process.env.SMOKE_DS_URL),
};

const results = [];
const short = (text) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > 120 ? `${flat.slice(0, 120)}...` : flat;
};

async function request(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: 'manual', ...init, signal: controller.signal });
    const body = await res.text();
    return { res, body };
  } finally {
    clearTimeout(timer);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(group, name, fn) {
  if (!targets[group]) {
    results.push({ status: 'SKIP', group, name, detail: `SMOKE_${group.toUpperCase()}_URL is not set` });
    return;
  }
  try {
    await fn(targets[group]);
    results.push({ status: 'PASS', group, name });
  } catch (err) {
    const detail = err.name === 'AbortError' ? `timeout after ${TIMEOUT_MS} ms` : err.message;
    results.push({ status: 'FAIL', group, name, detail });
  }
}

// ---------------------------------------------------------------- client ---

await check('client', 'connector page loads Trello Power-Up library and bundles', async (base) => {
  const { res, body } = await request(`${base}/`);
  expect(res.status === 200, `GET / returned ${res.status}`);
  expect(body.includes('p.trellocdn.com/power-up.min.js'), 'power-up.min.js is not referenced');
  expect(/global-[0-9a-f]+\.js/.test(body), 'global-<hash>.js bundle is not referenced');
  expect(body.includes('react-root'), '#react-root container is missing');
});

for (const route of ['card-button', 'show-settings', 'on-enable']) {
  await check('client', `route /${route} serves the SPA (iframe/modal URL used by Trello)`, async (base) => {
    const { res, body } = await request(`${base}/${route}`);
    expect(res.status === 200, `GET /${route} returned ${res.status}`);
    expect(body.includes('react-root'), `/${route} did not return index.html`);
  });
}

await check('client', 'card button icon /64.png', async (base) => {
  const { res } = await request(`${base}/64.png`);
  expect(res.status === 200, `GET /64.png returned ${res.status}`);
  expect((res.headers.get('content-type') || '').includes('image/png'), 'unexpected content-type');
});

await check('client', `translations for ${LOCALES.length} locales`, async (base) => {
  for (const locale of LOCALES) {
    const { res, body } = await request(`${base}/${locale}/translation.json`);
    expect(res.status === 200, `${locale}: HTTP ${res.status}`);
    const json = JSON.parse(body.replace(/^﻿/, ''));
    expect(typeof json['onlyoffice.files.file.open'] === 'string', `${locale}: key onlyoffice.files.file.open missing`);
  }
});

// ---------------------------------------------------------------- server ---

await check('server', 'Prometheus metrics endpoint', async (base) => {
  const { res, body } = await request(`${base}/metrics`);
  expect(res.status === 200, `GET /metrics returned ${res.status}`);
  expect(body.includes('process_cpu_user_seconds_total'), 'default Node metrics are missing');
});

await check('server', 'CORS allows https://trello.com', async (base) => {
  const { res } = await request(`${base}/onlyoffice/settings/encrypt`, {
    method: 'OPTIONS',
    headers: {
      Origin: TRELLO_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  expect(res.status < 300, `preflight returned ${res.status}`);
  expect(res.headers.get('access-control-allow-origin') === TRELLO_ORIGIN,
    `access-control-allow-origin is "${res.headers.get('access-control-allow-origin')}"`);
});

await check('server', 'callback rejects requests without a valid session', async (base) => {
  const { res, body } = await request(`${base}/onlyoffice/callback?session=invalid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'smoke', status: 4 }),
  });
  expect(res.status === 403, `expected 403, got ${res.status}`);
  expect(JSON.parse(body).error === 1, `expected {"error":1}, got ${short(body)}`);
});

await check('server', 'unknown routes redirect to trello.com', async (base) => {
  const { res } = await request(`${base}/smoke-test-unknown-route`);
  expect(res.status >= 300 && res.status < 400, `expected redirect, got ${res.status}`);
  expect((res.headers.get('location') || '').startsWith(TRELLO_ORIGIN),
    `redirect location is "${res.headers.get('location')}"`);
});

// ----------------------------------------------------------------- proxy ---
// The proxy is rate limited per IP (IP_LIMIT requests per second), so only one request is sent.

await check('proxy', 'proxy rejects requests without an encrypted secret', async (base) => {
  const { res, body } = await request(`${base}/proxy`);
  expect(res.status === 403, `expected 403, got ${res.status}`);
  expect(JSON.parse(body).error === 'secrets decryption error', `unexpected body: ${short(body)}`);
});

// ------------------------------------------------------- document server ---

await check('ds', 'Document Server healthcheck', async (base) => {
  const { res, body } = await request(`${base}/healthcheck`);
  expect(res.status === 200, `GET /healthcheck returned ${res.status}`);
  expect(body.trim() === 'true', `healthcheck body is "${short(body.trim())}"`);
});

await check('ds', 'Docs API script (api.js) is reachable', async (base) => {
  const { res, body } = await request(`${base}/web-apps/apps/api/documents/api.js`);
  expect(res.status === 200, `GET api.js returned ${res.status}`);
  expect(body.includes('DocsAPI'), 'api.js does not define DocsAPI');
});

// ---------------------------------------------------------------- report ---

for (const r of results) {
  const line = `${r.status.padEnd(4)}  [${r.group}] ${r.name}`;
  console.log(r.detail ? `${line}\n      ${r.detail}` : line);
}
const failed = results.filter((r) => r.status === 'FAIL').length;
const passed = results.filter((r) => r.status === 'PASS').length;
const skipped = results.filter((r) => r.status === 'SKIP').length;
console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
if (passed === 0 && failed === 0) {
  console.log('Nothing was checked: set at least one SMOKE_*_URL variable.');
  process.exitCode = 1;
}
if (failed > 0) process.exitCode = 1;
