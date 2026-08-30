# Contributing to rui

Thanks for helping improve `@bzync/rui`. Bug reports, documentation fixes,
accessibility improvements, and focused component contributions are welcome.

## Before opening an issue

- Search existing issues to avoid duplicates.
- Use the security reporting process in [SECURITY.md](./SECURITY.md) for
  vulnerabilities; do not disclose them in public issues.
- Include a minimal reproduction for bugs whenever possible.

## Development setup

This repository uses npm and requires a current Node.js release.

```sh
npm ci
npm --prefix demo ci
npm --prefix demo run dev -- --host 127.0.0.1 --port 4173
```

The demo at `http://127.0.0.1:4173` is the visual specification and Playwright
target. Do not use another package manager or hand-edit generated files in
`dist/`.

## Making changes

- Follow the component, accessibility, theming, and testing contracts in
  [AGENTS.md](./AGENTS.md).
- Keep changes focused and preserve backward compatibility unless a breaking
  change has been discussed first.
- Add or update unit tests for behavior changes.
- Update the demo when adding or changing visible component behavior.
- Never commit credentials, local environment files, or generated npm archives.

## Verification

Run the complete release gate before requesting review:

```sh
npm run release:check
```

For faster iteration, the individual checks are:

```sh
npm run typecheck
npm run test:unit
npm run build
npm --prefix demo run build
npm run test:e2e
```

## Pull requests

Describe the problem, the chosen solution, and how you verified it. Include
screenshots or recordings for visible changes and note any accessibility or
compatibility impact. Maintainers handle versioning and npm releases.

## Releasing to npm

Maintainers only. Add an npm publishing token to the GitHub repository as an
Actions secret named `NPM_TOKEN`. The publish workflow runs when a `v*` tag is
pushed and requires the tag to match the version in `package.json` exactly. When
the source repository is public, CI publishes with npm provenance attestations.

To publish the version currently declared in `package.json`:

```sh
VERSION="$(node --print "require('./package.json').version")"
git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin "v${VERSION}"
```

For later patch releases, commit all pending changes and run:

```sh
npm version patch
git push origin HEAD --follow-tags
```

`npm version patch` updates `package.json` and `package-lock.json`, creates a
release commit, and creates the matching version tag. Use `minor` or `major`
instead of `patch` when appropriate. GitHub Actions runs the complete
`release:check` gate before npm uploads the package.

### Retrying a failed release

Do not move or reuse an existing version tag after its workflow fails. Commit the
fixes, create the next patch version, and push its new tag:

```sh
git add .
git commit -m "Fix npm release workflow"
npm version patch
git push origin HEAD --follow-tags
```

For example, because `v0.0.2` failed, this creates and publishes `v0.0.3`.
