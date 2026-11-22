# @brutalway/check-secrets

`check-secrets` fails when a file git would commit holds a secret: an API key, a token, a private key, a connection string with a password. It runs [gitleaks](https://github.com/gitleaks/gitleaks), which it downloads from the gitleaks GitHub release on the first run and checks against a checksum pinned in the package.

## Install

```sh
npm install --save-dev @brutalway/check-secrets
```

## Usage

```sh
check-secrets
```

Run it in `npm run check`. It scans the folder it runs in and reports the secrets found in the files git tracks and in the new files git does not ignore, so a `.env` listed in `.gitignore` is left alone. Outside a git repository, it reports every file.

```
src/features/sync/syncClient.ts:4 github-pat: Uncovered a GitHub Personal Access Token, potentially leading to unauthorized repository access and sensitive content exposure. Remove it and revoke it, or, if it is public by design, add src/features/sync/syncClient.ts:github-pat:4 to .gitleaksignore
```

A secret that reached a commit stays in the history: revoke it, removing the line is not enough.

### A value that is public by design

A Firebase web key, a key of a test fixture: add the fingerprint the message gives to `.gitleaksignore`, one per line, and commit it. [`check-exceptions`](../check-exceptions) counts its lines, so the list only shrinks. The change that adds the first fingerprints writes their number under `newRules` in `package.json`: `"check-exceptions": { "newRules": { "gitleaks ignore": 2 } }`. A `.gitleaks.toml` in the folder changes the rules of gitleaks, see [its docs](https://github.com/gitleaks/gitleaks#configuration).

### Without a download

The first run downloads gitleaks 8.30.1, an 8 MB archive, into `node_modules/.cache/check-secrets/`, and the next runs use that copy. Offline, in a network that blocks GitHub, or on a platform with no gitleaks build, install gitleaks yourself and give its path:

```sh
GITLEAKS_BIN=/usr/local/bin/gitleaks check-secrets
```

## Reference

| Platform | Archive |
| --- | --- |
| Linux | x64, arm64 |
| macOS | x64, arm64 |
| Windows | x64, arm64 |

The archive is extracted with `tar`, which Windows ships since Windows 10. A download whose checksum does not match stops the check before anything runs.

Exit code 1 when it finds a secret or when gitleaks cannot run, 0 otherwise.

## Why

An agent writes a real value in a `.env.example`, pastes a token into a test, or commits a key to unblock a build, and every other check stays green. gitleaks has the largest set of rules among the open source scanners. It is a Go binary, so this package fetches the official build instead of asking for Docker or a third-party npm wrapper.
