# Release

The following steps should navigate you through the release process to ensure as few issues as possible.

## Steps

### Commit the changelog and publish to NPM

1. run `./bin/changelog` and add output to `CHANGELOG.md`
2. edit changelog output to be as user-friendly as possible (drop [INTERNAL] changes etc.)
3. bump package.json version
4. `./bin/prepare-release`
5. `git checkout master`
6. `git add` the modified `package.json` and `CHANGELOG.md`
7. `git commit -m "Release vx.y.z"`
8. `git push upstream master`
9. `git tag "vx.y.z"`
10. `git push upstream vx.y.z`
11. `npm publish ./ember-cli-deploy-s3-<version>.tgz`

### Create a github release

1. under `Releases` on GitHub choose `Draft New Release`
2. enter the new version number created above as the tag, prefixed with v e.g. (v0.1.12)
3. for release title choose a great name, no pressure.
4. in the description paste the upgrade instructions from the previous release, followed by the new CHANGELOG entry
5. publish the release
