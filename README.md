# Keep a Changelog release

Use this Github action to release unreleased changes in your changelog. [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format is supported.

## Operation release changelog

- Unreleased section is released as new version
- Compare links are updated
- Empty unreleased section is created
- Updated changelog is returned

## Operation read version changelog

- Returns changelog of concrete version

# Release changelog example

```
name: Release software
on:
  ...

jobs:
  release:
    steps:
      - uses: actions/checkout@v2
      - name: Update changelog
        uses: superfaceai/release-changelog-action@v2
        with:
          path-to-changelog: CHANGELOG.md  # optional, default value is `CHANGELOG.md`
          version: 1.0.0
          operation: release
          format: markdownlint # optional, valid values are `compact` (default) or `markdownlint`
```

# Read version changelog example

```
  name: Get version changelog
  on:
    ...

  jobs:
    get-changelog:
      steps:
        - uses: actions/checkout@v2
        - name: Get changelog
          id: get-changelog
          uses: superfaceai/release-changelog-action@v2
          with:
            path-to-changelog: CHANGELOG.md
            version: 1.0.0
            operation: read
        - name: Log changelog
          run: echo ${{ steps.get-changelog.outputs.changelog }}
```

# Development

## Install the dependencies

```shell
$ yarn install
```

## Run tests

```shell
$ yarn test
```

## Build and package it for distribution

```shell
$ yarn build && yarn package
```

## Publish action to a distribution

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```shell
$ npm run package
$ git add dist
$ git commit -a -m "chore: prod dependencies"
```

After testing make the new release available to those binding to the major version tag: Move the major version tag (v1, v2, etc.) to point to the ref of the current release.

```shell
$ git tag -fa v2 -m "Update v2 tag"
$ git push origin v2 --force
```
