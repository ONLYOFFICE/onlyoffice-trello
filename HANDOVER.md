# Handover: ONLYOFFICE Power-Up for Trello

Everything in this document was checked against the code, the git history or public sources (links inline) as of 2026-11-13.
Topics that could not be verified are left out on purpose rather than guessed.
No secrets belong in this file.

## 1. Integration type

**A Trello Power-Up (embedded in Trello through iframes) backed by three services that ONLYOFFICE runs itself.**

| Component | Folder | Stack | Role |
|---|---|---|---|
| client | `client/` | React 16, TypeScript, webpack 5, Atlaskit, MobX, i18next | Static app that Trello loads as the Power-Up iframe connector (`index.html` → `src/global.ts`). Capabilities: `card-buttons`, `show-settings`, `on-enable`. Routes `/card-button`, `/show-settings`, `/on-enable` are opened by Trello as modal/popup iframes. |
| server | `server/` | NestJS 10, Node 18 | Signs the editor config, receives Document Server callbacks, uploads saved files back to Trello, encrypts the Document Server JWT secret. Runs in Node `cluster` mode with one worker per CPU. |
| proxy | `proxy/` | Go 1.21 | Lets Document Server download a Trello attachment: decrypts the request parameters, checks the Document Server JWT, forwards to `api.trello.com` with the user's OAuth header. |

**ONLYOFFICE products.** Only ONLYOFFICE Docs (Document Server), cloud or self-hosted, through the Docs API:
- the editor page loads `{docs}/web-apps/apps/api/documents/api.js` with a config signed by the Document Server JWT secret (`server/src/views/editor.hbs`);
- `editorConfig.callbackUrl` → `POST /onlyoffice/callback`; statuses 2 (save) and 4 (closed without changes) are handled;
- `document.url` points to the proxy, never to Trello directly;
- editor events `onOutdatedVersion` and `onError` are posted to the parent window to reset the document key.

**Requirements on Document Server enforced by the code:**
- the address must be `https://`, a domain name (no IP, no port, no path) with a trailing slash: `validURL` in `client/src/utils/validation.ts` and `server/src/utils/validation.ts`;
- JWT is mandatory: settings cannot be saved without the secret and header, and files cannot be opened until the address and secret are set. The public README calls JWT "strongly recommended", which does not match the code.

**Trello.** Power-Up client library from `p.trellocdn.com`, REST API v1 with OAuth 1.0a user tokens (`scope: read,write`, `expires: never`), `t.jwt()` for signed state that the server verifies against Trello's public keys (`https://api.trello.com/1/resource/jwt-public-keys`). All per-board and per-workspace state lives in Trello pluginData; the services have no database.

**Public presence:**
- directory listing: https://trello.com/power-ups/620a31232ca1ad777e07c789/onlyoffice (linked from https://www.onlyoffice.com/office-for-trello);
- source: `git@git.onlyoffice.com:ONLYOFFICE/onlyoffice-trello.git` (origin) and the public mirror https://github.com/ONLYOFFICE/onlyoffice-trello;
- Docker images: `onlyoffice/trello-server`, `onlyoffice/trello-client`, `onlyoffice/trello-proxy` on Docker Hub.

### Open / save flow

```
Trello card ─▶ client iframe ── t.jwt(state{docKey, attachment, due:+60s}) ─▶ server POST /onlyoffice/editor
                                                                             │ verify Trello JWT, decrypt DS secret,
                                                                             │ check file size, GET /members/me
                                                                             ▼
                                       editor.hbs (api.js from Document Server + signed config)
                                                                             │
Document Server ── GET {PROXY_ADDRESS}/proxy?secret=…&resource=… ─▶ proxy ──▶ api.trello.com (OAuth header)
Document Server ── POST /onlyoffice/callback?session=… ─▶ server ──▶ POST /1/cards/{id}/attachments (NEW attachment)
                                                             └──▶ SSE /onlyoffice/events ─▶ client removes docKey
```

## 2. Key user scenarios

1. **Enable the Power-Up** on a board. `on-enable` opens settings for a board admin or workspace admin, and an info screen for everyone else.
2. **Configure Document Server** (address, JWT secret, JWT header):
   - per board (board admin);
   - shared for the whole workspace (workspace admin, "share" checkbox); a board admin can override it with local settings (added in 1.1.0);
   - the JWT secret is encrypted by the server, bound to the workspace ID, and only decrypted for an admin of the same workspace.
3. **Browse card attachments** with the ONLYOFFICE card button: list of supported files, search, sort by name/type/date/size, desktop and mobile layouts, download link.
4. **Edit DOCX, XLSX, PPTX** with real-time co-editing. Users share the document key through the card's pluginData.
5. **View other formats** (full list in `CHANGELOG.md` and `*/src/utils/file.ts`).
6. **Access mode:** edit only if the board permission is `write` and the extension is editable; otherwise view.
7. **Save:** the edited file is uploaded to the same card as a **new attachment**; the original is kept.
8. **Mobile editor** is chosen by User-Agent.
9. **Localization:** en-US, en-UK, de, es, fr, it, pt-BR, ru, zh-Hans.
10. **Prometheus metrics** at `GET /metrics` on the server.

### Manual smoke checklist

`scripts/smoke.mjs` covers what can be checked without a Trello account (see section 3). The scenarios below need a Trello board, a workspace admin and a regular member account, and a Document Server with JWT enabled. Use small files (under 1.5 MB, see section 5).

- [ ] Add the Power-Up to a board: the admin sees the settings popup, a regular member sees the info screen.
- [ ] Board admin saves address, secret and header: success alert; reopening settings shows the saved values.
- [ ] Invalid address (`http://`, IP, port, or a path) is rejected with an error alert.
- [ ] Workspace admin saves shared settings with "share" on: another board in the same workspace can open files without its own settings.
- [ ] On that board, a board admin ticks "local settings", saves own values; files open against the local Document Server.
- [ ] Card button lists only supported attachments; search and every sort option work; download works.
- [ ] Open a DOCX as a board member: editor opens in edit mode, in the user's Trello language.
- [ ] Repeat for XLSX and PPTX.
- [ ] Open a DOC or PDF: view mode only.
- [ ] Observer (read-only board permission) opens a DOCX: view mode only.
- [ ] Two users open the same DOCX at the same time: they see each other's cursors (same session).
- [ ] Edit, close the editor, wait for the save: a new attachment with the same name appears on the card; the original is still there.
- [ ] Reopen the file after the save: it opens the new state, not a stale session.
- [ ] Open a file and close without changes: no new attachment.
- [ ] Mobile browser (or narrow window): mobile file list layout; the editor opens in mobile mode.

## 3. Build

There are **no private repositories or private packages**: everything comes from the public npm registry and the Go module proxy.

| Part | Toolchain | Package manager | Commands |
|---|---|---|---|
| root | Node | yarn 1 | `yarn` installs husky hooks (commitlint, lint-staged) |
| client | Node 18.16.1 in Docker | **npm** (`package-lock.json`); the Dockerfile uses `yarn` without a lockfile | `npm ci`, `npm run build`, `npm run start:dev` (HTTP on 6541), `npm run lint` |
| server | Node 18.16.1 in Docker | yarn 1 (`yarn.lock`) | `yarn`, `yarn build` (→ `dist/main.js`), `yarn start:dev`, `yarn test`, `yarn lint` |
| proxy | Go 1.21 (`go.mod`); Docker uses unpinned `golang:alpine` | Go modules | `go build cmd/main.go`, `go test ./...` |
| CI | Node 22 | | `.github/workflows/licenses.yml`: dependency license check only, no build or tests |

Non-obvious points:
- **The client is configured at build time.** `BACKEND_HOST`, `POWERUP_NAME`, `POWERUP_APP_KEY` are inlined by webpack `EnvironmentPlugin`, so a client build or image only works for one environment. `client/.env` is read only in `--mode=development`.
- **The server validates its environment at startup** (`server/src/validation.ts`, joi): both encryption keys must be exactly 32 characters, `POWERUP_APP_SECRET` at least 60, `POWERUP_APP_KEY` at least 30. Validation runs on `process.env` before Nest loads `.env`, so locally run it with `yarn build && npx env-cmd -f .env node dist/main.js`. In the Docker image `server/.env_example` is renamed to `.env`; real values come from the container environment.
- **The proxy** reads `config.yml` from the working directory if present, otherwise environment variables `HOST`, `PORT`, `PROXY_KEY`, `LIMIT`, `IP_LIMIT`, `ENV` (`ENV=2` switches to the production logger). `proxy/.env` is **not** loaded automatically.
- `PROXY_ENCRYPTION_KEY` (server) and `PROXY_KEY` (proxy) must be the same value; `docker-compose.yml` passes the same variable to both.
- `POWERUP_APP_KEY` / `POWERUP_APP_SECRET` are the Trello API key and OAuth secret of the Power-Up.
- **Docker:** a single `Dockerfile` with targets `server`, `client`, `proxy`, plus `docker-compose.yml` and `.env.docker.example`. `hooks/build` and `hooks/push` follow the Docker Hub automated-build convention (`$DOCKER_TAG` → `PRODUCT_VERSION`). Docker Hub image tags do not map 1:1 to git tags (for example `trello-server` has tags 1.1.2–1.1.9 published before the `v1.1.0` git release, and 1.1.0 on 2024-11-05).
- **Build images from a clean checkout:** `.dockerignore` excludes only `node_modules`, so local untracked files such as `proxy/config.yml` would be copied into the image.
- `IS_DEBUG=1` is for local development only.
- **Commits:** conventional commits are enforced by commitlint through husky (`core.hooksPath=.husky` after `yarn` in the root).
- **Tests:** server `yarn test` (jest, needs `server/.env`), proxy `go test ./...`. Both currently fail; see section 6. The client has no tests.
- **Deployment smoke test** (no Trello account or secrets needed; any URL left unset is skipped):

  ```bash
  SMOKE_CLIENT_URL=https://… SMOKE_SERVER_URL=https://… SMOKE_PROXY_URL=https://… SMOKE_DS_URL=https://…/ node scripts/smoke.mjs
  ```

  It checks the connector page and SPA routes, card icon, all 9 translation files, server metrics, CORS for `https://trello.com`, callback rejection, the 404 redirect, proxy rejection, and the Document Server healthcheck and `api.js`. It sends only one request to the proxy because of the per-IP rate limit.
- **Local development:** Trello loads the connector from the iframe connector URL registered for the Power-Up, and that URL must be HTTPS. The locally served client (HTTP on 6541) therefore has to be exposed over HTTPS and registered as the connector URL of a Power-Up you own (never the public one); `BACKEND_HOST` must reach your server.

## 4. Publishing to marketplaces

The Power-Up has one marketplace: the **Trello Power-Up directory** (listing linked in section 1; onlyoffice.com labels it "Atlassian Marketplace"). Nothing is uploaded there as a package: users always get whatever the client, server and proxy deployments currently serve. A release therefore means deploying the services; the listing changes only when its texts, icons or settings change.

Where things are managed (Atlassian documentation):
- **Power-Up settings:** Power-Up admin portal, https://trello.com/power-ups/admin (also reachable as `trello.com/apps/admin`).
  - *Basic information*: iframe connector URL (must be HTTPS). Since July 2024 the connector domain of a public Power-Up can be changed there without contacting Trello.
  - *Capabilities* tab: the enabled capabilities must match the keys passed to `TrelloPowerUp.initialize` in `client/src/global.ts`: `card-buttons`, `show-settings`, `on-enable`. A capability that is not enabled in the portal is not shown, even if the code declares it.
  - Public Power-Ups must have every field filled, including Support Email and Privacy Policy.
- **Directory listing** (Overview, Description, a separate listing per locale): Developer Portal → the Power-Up → *Listings*, or the API `PUT /1/plugin/{idPlugin}/listing/{idListing}`. https://developer.atlassian.com/cloud/trello/guides/power-ups/listings/
- **Review of new public Power-Ups:** register the Power-Up and sign the Joint Developer Agreement, fill all admin-portal fields, submit through the form, then Atlassian tests it against the guidelines and sends feedback by email. Review usually takes two weeks or more; marketing materials take 5–10 business days. https://developer.atlassian.com/cloud/trello/guides/power-ups/submitting-your-power-up/
- **Guidelines a public Power-Up must keep meeting** (no console errors, quick responses, user data and token protection, onboarding through `on-enable`, a disconnect option in `show-settings`, and others): https://developer.atlassian.com/cloud/trello/guides/power-ups/public-power-up-guidelines/

The Atlassian documentation does not say whether changes to an already listed Power-Up require a new review. Check with Atlassian before changing capabilities or the connector URL.

Code release history (tags `v1.0.0` 2022-04-12, `v1.0.1` 2024-08-06, `v1.1.0` 2024-11-05):
1. On `develop`: bump the version in `package.json` (root, client, server) and `client/package-lock.json`, and add a section to `CHANGELOG.md`.
2. Open a PR `Release/X.Y.Z` from `develop` to `main` on git.onlyoffice.com.
3. Tag `vX.Y.Z` on the merge commit in `main`.
4. Merge `main` back into `develop`.

The step-by-step procedure is in `.claude/skills/release/SKILL.md`.

## 5. Implicit knowledge

- **Why the proxy exists.** Document Server cannot download a Trello attachment without the user's OAuth header. The server encrypts that header and the Document Server JWT secret (AES-256-GCM with `PROXY_ENCRYPTION_KEY`, hex-encoded nonce + ciphertext + tag) into the `secret` query parameter; the attachment path goes base64-encoded in `resource`. The secret is valid for **80 seconds**. The server (`SecurityService.encrypt`) and the proxy (`pkg/aes.go`) must stay byte-compatible.
- **File size limit ~1.5 MB.** The client hides the Open button above 1.5 MB (`FileControls.tsx`), although clicking the file name still opens it, and the server refuses files above 1.6 MB (`ValidatorUtils.validateFileSize`). Proxy request timeouts are 4 seconds (`http.TimeoutHandler` and `WriteTimeout`). The history gives no reason for the limit; test downloads through the proxy before raising it.
- **Saving always creates a new attachment.** The Trello REST API has no endpoint to replace an attachment's content (only list, create, get, delete): https://developer.atlassian.com/cloud/trello/rest/api-group-cards/
- **The document key lives in card pluginData** (`card/shared/{attachmentId}`) because the services have no shared storage. pluginData is limited to 4096 characters, so on overflow the oldest key is evicted (`client/src/api/handlers/signature.ts`). The `delay(2000)` and re-read after writing a new key make two users who open the same file at the same moment end up in one session.
- **Resetting the key after a save:** the server emits an SSE event with the attachment ID; after the modal closes, the client listens to `/onlyoffice/events` for 15 seconds and deletes the key. The `onOutdatedVersion` and `onError` editor events (posted as `cleanup` / `error`) are a second path that deletes a stale key.
- **Server state is per process:** the cache (`CacheModule`, in memory, TTL 40 s) and the SSE `EventEmitter` live in each cluster worker separately.
- **The modal and the card-button callback hand data over through `localStorage`** (`ONLYOFFICE_ATTACHMENT`, `ONLYOFFICE_ATTACHMENT_KEY`).
- **The `onLoad` counter in `Editor.tsx`** exists because the iframe fires `onLoad` twice (empty frame, then the editor page); only the second one is checked.
- **Private Trello API:** `rest.t.secret` in `client/src/api/handlers/card.ts` reads an internal field of the Trello REST client, so an update of `power-up.min.js` can break it.
- **Never change `POWERUP_APP_ENCRYPTION_KEY`** or the encryption format: every workspace's and board's JWT secret is stored in Trello pluginData encrypted with it, and all customers would have to re-enter their settings.
- **Duplicated logic that must change together:** supported/editable extension tables (`client/src/utils/file.ts` and `server/src/utils/file.ts`) and Document Server URL validation (client and server `validation.ts`).
- Unknown server routes redirect to `https://trello.com` (`server/src/filters/notfound.ts`).
- **Settings keys in pluginData** (`TrelloSettings` in `client/src/types/trello.d.ts`): `docsAddress`, `docsHeader`, `docsJwt` (encrypted), `docsHasShared` (organization), `docsUseShared` (board). Renaming them breaks every existing installation.

## 6. Known problems, tech debt, branches

- **Broken tests, not run in CI:**
  - server: 2 of 4 jest suites fail because jest does not transform the ESM build of axios 1.x;
  - proxy: `pkg` fails (`TestJwtVerification` uses a hard-coded expired JWT; `TestNewProxy` and `TestProxyRequest` expectations are outdated).
- **Outdated stack:** React 16, TypeScript 4, ESLint 7, Jest 27, Node 18 (end of life) in Docker, `github.com/golang-jwt/jwt` v3, `cache-manager` 3.
- **Non-reproducible client image:** `package-lock.json` is committed, but the Dockerfile runs `yarn` without a lockfile. The Go builder image is not pinned.
- README says JWT is "strongly recommended" while the code requires it.
- Translations for `onlyoffice.configure.access.title` / `.description` exist only in en-US.
- The root `.lintstagedrc` matches `src/**`, which does not exist in the root, so the pre-commit hook checks nothing.
- **Dead code:** `CacheService.getDocKey/setDocKey`, `server/src/models/command.ts`, `Constants.getDocumentServerCommandUrl` (left over from a removed Document Server version check), and `events.onOutdatedVersion` in the server-side `Config` (dropped by `JSON.stringify`).
- TODO refactorings in `client/src/components/card-button/file/*`, `client/src/utils/sort.ts`, `proxy/cmd/config/config.go`, and custom headers in `proxy/server/middleware/encryption.go`.

**Branches.** The remote has only `develop` (main line) and `main` (releases, last release `v1.1.0`); `develop` is 5 commits ahead of `origin/main` (README, license CI, merges). Older local clones may still show `feature/share-settings`, `fix/*` and `dependabot/*`: they were merged or superseded and no longer exist on the remote. Run `git fetch --prune`.

## 7. Plans and commitments

There are no open plans or commitments to customers or partners at handover time.
