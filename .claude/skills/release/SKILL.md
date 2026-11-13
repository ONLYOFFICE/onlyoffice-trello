---
name: release
description: Release a new version of the ONLYOFFICE Power-Up for Trello - version bump, changelog, develop→main release PR, tag, Docker images, deployment smoke test, and Trello Power-Up directory/admin-portal steps. Use when asked to cut, prepare or publish a release, bump the version, or update the Trello listing.
---

# Release: ONLYOFFICE Power-Up for Trello

The Power-Up is not uploaded to the Trello directory as a package. Users always get what the deployed client, server and proxy serve, so **a release is a deployment**. The Trello listing changes only when texts, icons, capabilities or the connector URL change.

Steps marked **[manual]** need a human with the corresponding access. Stop and ask the user before each of them; never improvise them, and never push, merge, tag or publish without explicit confirmation.

## 0. Preconditions

```bash
git fetch --prune origin
git switch develop && git pull --ff-only
git status --short          # must be empty
```

Decide the version `X.Y.Z` with the user (semver; the last release is the newest `v*` tag: `git tag -l --sort=-creatordate | head -1`).

## 1. Pre-release checks

```bash
cd server && yarn && yarn build && yarn test; cd ..
cd proxy && go build ./... && go test ./...; cd ..
cd client && npm ci && npm run build; cd ..
```

Known baseline failures (not regressions): server `yarn test` fails 2 of 4 suites (jest cannot load ESM axios); proxy `go test ./pkg` fails `TestJwtVerification`, `TestNewProxy`, `TestProxyRequest`. Any other failure blocks the release.

The client production build needs `BACKEND_HOST`, `POWERUP_NAME`, `POWERUP_APP_KEY` in the environment; without them the build succeeds but the bundle is unusable. Here it only checks that the code compiles.

## 2. Version bump and changelog

1. Set the version in `package.json` and `server/package.json` (edit the `"version"` field), and in `client/` run `npm version X.Y.Z --no-git-tag-version`, which updates `client/package.json` and `client/package-lock.json` together. The previous release commit (`2e99dcf`, 1.1.0) changed exactly these 5 files including `CHANGELOG.md`.
2. Add a section on top of `CHANGELOG.md` in the existing format:

   ```markdown
   ## X.Y.Z
   ## Added
   - ...

   ## Changed
   - ...
   ```

   Build it from `git log --oneline vPREV..develop`, user-facing changes only.
3. Commit on `develop` with a conventional message (the commit-msg hook runs commitlint), e.g. `chore(release): X.Y.Z`.

## 3. Release PR, tag, back-merge [manual: push and merge rights on git.onlyoffice.com]

1. Push `develop` and open a PR `Release/X.Y.Z` from `develop` into `main` on git.onlyoffice.com (Gitea).
2. After it is merged, tag the merge commit in `main`:

   ```bash
   git fetch origin && git tag vX.Y.Z origin/main && git push origin vX.Y.Z
   ```

3. Merge `main` back into `develop` and push (the history does this as `Merge remote-tracking branch 'remotes/origin/main' into develop`).

The repository is mirrored to https://github.com/ONLYOFFICE/onlyoffice-trello. The repository does not show how the mirror is synced; after the release, check that `main` and the tag appear there.

## 4. Docker images [manual: push rights to the `onlyoffice` organization on Docker Hub]

From a **clean checkout of the tag**, because `.dockerignore` excludes only `node_modules` and local untracked files such as `proxy/config.yml` would end up in the images:

```bash
git clone --branch vX.Y.Z git@git.onlyoffice.com:ONLYOFFICE/onlyoffice-trello.git release-X.Y.Z && cd release-X.Y.Z
export DOCKER_TAG=X.Y.Z ENABLE_BUNDLE_ANALYZER=0 SERVER_HOST=<production server URL> POWERUP_NAME=<name> POWERUP_APP_KEY=<Trello API key>
bash hooks/build && bash hooks/push
```

This produces `onlyoffice/trello-server:X.Y.Z`, `onlyoffice/trello-client:X.Y.Z`, `onlyoffice/trello-proxy:X.Y.Z`. The client image has the server URL and Trello key baked in, so build it with production values. Ask the user for them; never write them into files or commit them.

## 5. Deploy [manual]

The deployment target and procedure are not described in this repository. Ask the user how and where the images are deployed. Required runtime environment (names only): see `.env.docker.example` and `docker-compose.yml`. `PROXY_ENCRYPTION_KEY` on the server must equal `PROXY_KEY` on the proxy, and `POWERUP_APP_ENCRYPTION_KEY` must never change between releases.

## 6. Verify

1. Automated smoke test against production (no secrets needed):

   ```bash
   SMOKE_CLIENT_URL=https://<client> SMOKE_SERVER_URL=https://<server> SMOKE_PROXY_URL=https://<proxy> \
   SMOKE_DS_URL=https://<a Document Server>/ node scripts/smoke.mjs
   ```

   All checks must pass.
2. [manual] Go through the "Manual smoke checklist" in `HANDOVER.md` section 2 on a real Trello board.

## 7. Trello Power-Up directory [manual: collaborator on the Power-Up in the admin portal]

Needed only if something listing-related changed. The Power-Up ID is `620a31232ca1ad777e07c789` (public listing: https://trello.com/power-ups/620a31232ca1ad777e07c789/onlyoffice).

- **Capabilities changed in `client/src/global.ts`:** enable or disable the same capability in https://trello.com/power-ups/admin → the Power-Up → *Capabilities* **before** deploying a client that uses a new one, and after removing one from code. A capability that is not enabled in the portal is not shown.
- **Connector URL / client host changed:** *Basic information* → Iframe connector URL (must be HTTPS).
- **Listing texts or images:** Developer Portal → the Power-Up → *Listings*: *Overview* (plain text, shown in search) and *Description* (markdown), one listing per locale. Keep the locales in line with `client/src/i18n/locales/`. API alternative: `PUT /1/plugin/{idPlugin}/listing/{idListing}`.
- **Support email / privacy policy:** admin portal fields; all of them must stay filled for a public Power-Up.

Atlassian documents a review (usually two weeks or more) for **new** public Power-Ups and a list of guidelines public Power-Ups must keep meeting (no console errors, fast responses, onboarding via `on-enable`, a disconnect option in `show-settings`, protection of tokens and user data). It does not document whether an update to a listed Power-Up triggers a new review. Before changing capabilities, the connector domain or the core flow, tell the user and suggest confirming with Atlassian.

- https://developer.atlassian.com/cloud/trello/guides/power-ups/submitting-your-power-up/
- https://developer.atlassian.com/cloud/trello/guides/power-ups/public-power-up-guidelines/
- https://developer.atlassian.com/cloud/trello/guides/power-ups/listings/

## 8. Wrap up

Report to the user: version, tag, image tags, smoke result, which manual steps were done and which are still pending.
