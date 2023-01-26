import fs from 'fs';
import {MarkdownFormat, releaseChangelog} from './releaseChangelog';

function expectedChangelogInCompactFormat(releaseDate: Date): string {
  return `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.1.0] - ${releaseDate.toISOString().slice(0, 10)}
### Added
- New feature

## [1.0.0] - 2021-04-30
### Added
- First version

[Unreleased]: https://github.com/janhalama/test-package-releasing/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/janhalama/test-package-releasing/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/janhalama/test-package-releasing/releases/tag/v1.0.0
`;
}

function expectedChangelogInMarkdownLintFormat(releaseDate: Date): string {
  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.1.0] - ${releaseDate.toISOString().slice(0, 10)}

### Added

- New feature

## [1.0.0] - 2021-04-30

### Added

- First version

[Unreleased]: https://github.com/janhalama/test-package-releasing/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/janhalama/test-package-releasing/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/janhalama/test-package-releasing/releases/tag/v1.0.0
`;
}

describe('releaseChangelog', () => {
  it('should return updated changelog in compact format', () => {
    fs.writeFileSync = jest.fn();
    expect(
      releaseChangelog('./src/fixtures/CHANGELOG.fixture.md', 'v1.1.0')
    ).toEqual(expectedChangelogInCompactFormat(new Date()));
  });

  it('should return updated changelog in markdownlint format', () => {
    fs.writeFileSync = jest.fn();
    expect(
      releaseChangelog(
        './src/fixtures/CHANGELOG.fixture.md',
        'v1.1.0',
        MarkdownFormat.Markdownlint
      )
    ).toEqual(expectedChangelogInMarkdownLintFormat(new Date()));
  });

  it('should write updated changelog to file system', () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    releaseChangelog('./src/fixtures/CHANGELOG.fixture.md', 'v1.1.0');
    expect(writeFileSyncSpy).toBeCalled();
    expect(writeFileSyncSpy.mock.calls[0][0]).toBe(
      './src/fixtures/CHANGELOG.fixture.md'
    );
    expect(writeFileSyncSpy.mock.calls[0][1]).toBe(
      expectedChangelogInCompactFormat(new Date())
    );
  });

  it('should throw if version has been already released', () => {
    expect(() => {
      releaseChangelog('./src/fixtures/CHANGELOG.fixture.md', 'v1.0.0');
    }).toThrowError(
      'Unable to release version v1.0.0 which has already been released'
    );
  });

  it('should throw if unreleased section is missing', () => {
    expect(() => {
      releaseChangelog(
        './src/fixtures/CHANGELOG_UNRELEASED_MISSING.fixture.md',
        '1.1.0'
      );
    }).toThrowError('Unreleased changelog section not found');
  });

  it('should throw if changelog file format is corrupted', () => {
    expect(() => {
      releaseChangelog(
        './src/fixtures/CHANGELOG_CORRUPTED.fixture.md',
        '1.1.0'
      );
    }).toThrowError('Unable to parse changelog. Parser error:');
  });
});
