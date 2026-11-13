# CLAUDE.md

ONLYOFFICE Power-Up for Trello: edit Trello card attachments in ONLYOFFICE Docs.
Three deployables: `client/` (Power-Up iframe UI), `server/` (editor config, Docs callbacks, saving to Trello), `proxy/` (lets Document Server download Trello attachments).
Architecture, implicit knowledge and the manual test checklist are in `HANDOVER.md`; read the relevant section before non-trivial changes.

## Commands

| Where | Install | Build | Test / check |
|---|---|---|---|
| root | `yarn` (installs husky hooks) | | `node scripts/smoke.mjs` with `SMOKE_{CLIENT,SERVER,PROXY,DS}_URL` set (deployment smoke test) |
| `client/` | `npm ci` (npm, not yarn) | `npm run build`, dev build + serve on :6541: `npm run start:dev` | `npm run lint` (no tests) |
| `server/` | `yarn` | `yarn build` | `yarn test`, `yarn lint`; run: `npx env-cmd -f .env node dist/main.js` |
| `proxy/` | | `go build ./...` | `go test ./...`, `go vet ./...` |
| all | | Docker images: `hooks/build` (wraps `docker-compose build` and passes the client build args) | |

Known baseline: `yarn test` fails 2 of 4 suites (jest vs ESM axios) and `go test ./pkg` fails (expired JWT fixture, outdated proxy tests). Don't treat these as regressions; do treat any new failure as one.

## Layout

- `client/src/global.ts`: `TrelloPowerUp.initialize` with capabilities `card-buttons`, `show-settings`, `on-enable`. `router.tsx` maps them to `/card-button`, `/show-settings`, `/on-enable`.
- `client/src/api/handlers/`: Trello auth, settings in pluginData, document key handling (`signature.ts`), SSE cleanup.
- `server/src/controllers/onlyoffice.controller.ts`: `POST /onlyoffice/editor`, `POST /onlyoffice/callback`, `GET /onlyoffice/events` (SSE). `settings.controller.ts`: `/onlyoffice/settings/{encrypt,decrypt}`. Callback statuses are handled in `controllers/handlers/conventional/`.
- `server/src/middlewares/token.ts`: verifies Trello-signed JWTs. `services/security.service.ts`: AES-256-GCM and JWT helpers.
- `proxy/server/middleware/encryption.go`: decrypts `secret`/`resource`, checks the Docs JWT; `pkg/proxy.go`: reverse proxy to `api.trello.com`.
- Env: `.env.docker.example`, `client/.env.example`, `server/.env_example`, `proxy/.env.example`. Server env is validated by `server/src/validation.ts`.

## Conventions

- Conventional commits (commitlint runs in the husky `commit-msg` hook).
- Branches: work from `develop`; releases go `develop` → `main` through a `Release/X.Y.Z` PR and a `vX.Y.Z` tag (see the `release` skill).
- Code style: client follows `client/.eslintrc.js` (4-space JSX, single quotes in JSX, `{a}` without inner spaces); server follows `server/.eslintrc.js` + `.prettierrc` (single quotes, trailing commas). Path aliases: client `components/*`, `root/*`, `types/*`, `public/*`; server `@controllers/*`, `@services/*`, `@utils/*`, `@models/*`, etc.
- Every user-visible string goes through i18next; add the key to all 9 files in `client/src/i18n/locales/`.
- Public files (code, docs in the repo) are in English.

## Don'ts

- Don't commit secrets, `.env` files, `proxy/config.yml` or `dist/`. Don't write secret values into docs; name the variable instead.
- Don't change `POWERUP_APP_ENCRYPTION_KEY` handling or the AES format in `security.service.ts`: customer settings stored in Trello pluginData are encrypted with it. The proxy (`proxy/pkg/aes.go`) must stay able to decrypt what the server encrypts.
- Don't rename the pluginData keys (`docsAddress`, `docsHeader`, `docsJwt`, `docsHasShared`, `docsUseShared`, per-attachment document keys): existing installations depend on them.
- Don't change only one side of duplicated logic: extension tables (`client/src/utils/file.ts` ↔ `server/src/utils/file.ts`) and Document Server URL validation (`client/src/utils/validation.ts` ↔ `server/src/utils/validation.ts`).
- Don't add a capability in `global.ts` without enabling it in the Trello Power-Up admin portal; don't remove one without disabling it there.
- Don't enable `IS_DEBUG=1` outside local development.
- Don't build Docker images from a working copy with untracked local config files; `.dockerignore` does not exclude them.
