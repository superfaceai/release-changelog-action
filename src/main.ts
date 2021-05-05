import * as core from '@actions/core';
import {releaseChangelog} from './releaseChangelog';

async function run(): Promise<void> {
  try {
    const pathToChangelog = core.getInput('path-to-changelog');
    core.info(`Changelog path: ${pathToChangelog}`);

    const version = core.getInput('version');
    core.info(`Releasing version: ${version}`);

    releaseChangelog(pathToChangelog, version);

    core.info('Changelog update finished');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
