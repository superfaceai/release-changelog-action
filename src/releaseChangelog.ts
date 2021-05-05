import fs from 'fs';
import {parser, Release} from 'keep-a-changelog';

export function releaseChangelog(
  changelogPath: string,
  version: string
): string {
  let changelog;
  try {
    changelog = parser(fs.readFileSync(changelogPath, 'utf8'));
  } catch (err) {
    throw Error(`Unable to parse changelog. Parser error: ${err.message}`);
  }

  const release = changelog.findRelease(version);
  if (release) {
    throw Error(
      `Unable to release version ${version} which has already been released`
    );
  }

  const unreleased = changelog.findRelease();
  if (!unreleased) {
    throw Error('Unreleased changelog section not found');
  }

  unreleased.date = new Date();
  unreleased.setVersion(version);

  changelog.addRelease(new Release()); // new unreleased section

  const releasedChangelogMarkdown = changelog.toString();

  fs.writeFileSync(changelogPath, releasedChangelogMarkdown);
  return releasedChangelogMarkdown;
}
