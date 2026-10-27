# Release Process

Releases are mostly automated using
[release-it](https://github.com/release-it/release-it/) and
[lerna-changelog](https://github.com/lerna/lerna-changelog/).

## Preparation

Since the majority of the actual release process is automated, the primary
remaining task prior to releasing is confirming that all pull requests that
have been merged since the last release have been labeled with the appropriate
`lerna-changelog` labels and the titles have been updated to ensure they
represent something that would make sense to our users. Some great information
on why this is important can be found at
[keepachangelog.com](https://keepachangelog.com/en/1.0.0/), but the overall
guiding principle here is that changelogs are for humans, not machines.

When reviewing merged PR's the labels to be used are:

* breaking - Used when the PR is considered a breaking change.
* enhancement - Used when the PR adds a new feature or enhancement.
* bug - Used when the PR fixes a bug included in a previous release.
* documentation - Used when the PR adds or updates documentation.
* internal - Used for internal changes that still require a mention in the
  changelog/release notes.

Unlabeled PRs are left out of the changelog.

## Release

Once the prep work is completed, the actual release is straight forward:

* First, check out an up-to-date `master` and install the project's
  dependencies:

```sh
git checkout master
git pull
pnpm install
```

* Second, ensure that you are logged in to npm as a user with publish access
  to `ember-cli-deploy-s3`. `npm whoami` should print your username.

* Third, ensure that you have obtained a
  [GitHub personal access token][generate-token] with the `repo` scope (no
  other permissions are needed). lerna-changelog reads it from the
  `GITHUB_AUTH` environment variable, and release-it reads it from
  `GITHUB_TOKEN` to create the GitHub release, so set both.

  For instance:

  ```bash
  export GITHUB_AUTH=abc123def456
  export GITHUB_TOKEN=$GITHUB_AUTH
  ```

[generate-token]: https://github.com/settings/tokens/new?scopes=repo&description=GITHUB_AUTH+env+variable

* And last (but not least 😁) do your release.

```sh
pnpm release
```

[release-it](https://github.com/release-it/release-it/) manages the actual
release process. It will prompt you to choose the version number (or pass it
directly, e.g. `pnpm release minor`). The changelog entry is generated from
the labeled PRs and written straight to `CHANGELOG.md` and the GitHub release,
without opening an editor, so fix up labels and titles beforehand. `release-it`
then continues on to committing, tagging, pushing the tag and commits,
publishing to npm, and creating the GitHub release.

To preview a release without changing anything, run `pnpm release --dry-run`.
