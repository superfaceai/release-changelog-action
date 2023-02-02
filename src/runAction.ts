import * as core from '@actions/core';
import {getVersionChangelog} from './getVersionChangelog';
import {
  MarkdownFormat,
  MarkdownFormats,
  releaseChangelog
} from './releaseChangelog';

export async function runAction(): Promise<void> {
  try {
    const pathToChangelog = core.getInput('path-to-changelog');
    const version = core.getInput('version');
    const operation = core.getInput('operation');
    const formatInput = core.getInput('format')?.toLowerCase();

    let format: MarkdownFormat = 'compact';

    if (MarkdownFormats.find(fmt => fmt === formatInput)) {
      format = formatInput as MarkdownFormat;
    }

    core.info(
      `${operation} changelog, path: ${pathToChangelog}, version: ${version}, format: ${format}`
    );

    switch (operation) {
      case 'release':
        core.setOutput(
          'changelog',
          releaseChangelog(pathToChangelog, version, format)
        );
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
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error');
    }
  }
}
