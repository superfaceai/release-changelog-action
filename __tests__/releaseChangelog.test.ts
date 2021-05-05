import fs from 'fs';
import {releaseChangelog} from '../src/releaseChangelog';

function expectedChangelog(releaseDate: Date) {
  return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.1.0] - ${releaseDate.toISOString().slice(0, 10)}
### Added
- New feature

## 1.0.0 - 2021-04-30
### Added
- First version

[Unreleased]: https://github.com/janhalama/test-package-releasing/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/janhalama/test-package-releasing/compare/v1.0.0...v1.1.0
`;
}

describe('releaseChangelog', () => {
  it('should return updated changelog', () => {
    fs.writeFileSync = jest.fn();
    expect(
      releaseChangelog('./__tests__/fixtures/CHANGELOG.fixture.md', 'v1.1.0')
    ).toBe(expectedChangelog(new Date()));
  });

  it('should write updated changelog to file system', () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    releaseChangelog('./__tests__/fixtures/CHANGELOG.fixture.md', 'v1.1.0');
    expect(writeFileSyncSpy).toBeCalled();
    expect(writeFileSyncSpy.mock.calls[0][0]).toBe(
      './__tests__/fixtures/CHANGELOG.fixture.md'
    );
    expect(writeFileSyncSpy.mock.calls[0][1]).toBe(
      expectedChangelog(new Date())
    );
  });

  it('should throw if version has been already released', () => {
    expect(() => {
      releaseChangelog('./__tests__/fixtures/CHANGELOG.fixture.md', 'v1.0.0');
    }).toThrowError(
      'Unable to release version v1.0.0 which has already been released'
    );
  });

  it('should throw if unreleased section is missing', () => {
    expect(() => {
      releaseChangelog(
        './__tests__/fixtures/CHANGELOG_UNRELEASED_MISSING.fixture.md',
        '1.1.0'
      );
    }).toThrowError('Unreleased changelog section not found');
  });

  it('should throw if changelog file format is corrupted', () => {
    expect(() => {
      console.debug(
        releaseChangelog(
          './__tests__/fixtures/CHANGELOG_CORRUPTED.fixture.md',
          '1.1.0'
        )
      );
    }).toThrowError('Unable to parse changelog. Parser error:');
  });
});
