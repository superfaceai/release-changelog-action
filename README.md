
# Keep a Changelog release

Use this Github action to release unreleased changes in your changelog. [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format is supported.

* Unreleased section is released as new version
* Compare links are updated
* Empty unreleased section is created

# Example

```
name: Release software
on:
  ...

jobs:
  release:
    steps:
      - uses: actions/checkout@v2
      - name: Update changelog
        uses: @superfaceai/release-changelog-action@v1
        with:
          path-to-changelog: CHANGELOG.md
          version: 1.0.0 # You should pass actual version not constant
```

# Development

## Install the dependencies  
```bash
$ yarn install
```

## Run tests
```
$ yarn test
```

## Build and package it for distribution
```
$ yarn build && yarn package
```

## Publish action to a distribution

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
