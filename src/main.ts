import * as core from '@actions/core';
import {getVersionChangelog} from './getVersionChangelog';
import {releaseChangelog} from './releaseChangelog';

async function run(): Promise<void> {
  try {
    const pathToChangelog = core.getInput('path-to-changelog');
    const version = core.getInput('version');
    const operation = core.getInput('operation');
    core.info(
      `${operation} changelog, path: ${pathToChangelog}, version: ${version}`
    );

    switch (operation) {
      case 'release':
        core.setOutput('changelog', releaseChangelog(pathToChangelog, version));
        break;
      case 'read':
        core.setOutput(
          'changelog',
          getVersionChangelog(pathToChangelog, version)
        );
        break;
      default:
        throw Error(`Operation ${operation} not supported`);
    }

    core.info(`${operation} changelog finished`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
