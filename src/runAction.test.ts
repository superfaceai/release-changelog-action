import * as core from '@actions/core';
import * as releaseChangelogModule from './releaseChangelog';
import * as getVersionChangelogModule from './getVersionChangelog';
import {runAction} from './runAction';

describe('runAction', () => {
  let getInputSpy: jest.SpyInstance;
  let setOutputSpy: jest.SpyInstance;
  let setFailedSpy: jest.SpyInstance;
  let releaseChangelogSpy: jest.SpyInstance;
  let getVersionChangelogSpy: jest.SpyInstance;
  let inputs: {[key: string]: string} = {};

  describe('when operation = release', () => {
    beforeEach(() => {
      getInputSpy = jest.spyOn(core, 'getInput');
      setOutputSpy = jest.spyOn(core, 'setOutput');
      releaseChangelogSpy = jest.spyOn(
        releaseChangelogModule,
        'releaseChangelog'
      );
      inputs = {
        operation: 'release',
        'path-to-changelog': './CHANGELOG.MD',
        version: '1.0.0'
      };

      getInputSpy.mockImplementation((name: string): string => {
        return inputs[name];
      });
      releaseChangelogSpy.mockImplementation(() => {
        return '# Changelog';
      });
    });

    it('should call releaseChangelog with valid params', async () => {
      await runAction();

      expect(releaseChangelogSpy).toBeCalledWith(
        './CHANGELOG.MD',
        '1.0.0',
        'compact'
      );
    });

    it('should set markdown output', async () => {
      await runAction();

      expect(setOutputSpy).toBeCalledWith('changelog', '# Changelog');
    });

    describe('when markdownlint format input passed', () => {
      it('should call releaseChangelog with markdownlint format param', async () => {
        inputs.format = 'markdownlint';
        await runAction();

        expect(releaseChangelogSpy).toBeCalledWith(
          './CHANGELOG.MD',
          '1.0.0',
          'markdownlint'
        );
      });
    });

    describe('when unsupported format input passed', () => {
      it('should fallback to compact format', async () => {
        inputs.format = 'unsupported format';
        await runAction();

        expect(releaseChangelogSpy).toBeCalledWith(
          './CHANGELOG.MD',
          '1.0.0',
          'compact'
        );
      });
    });
  });

  describe('when operation = read', () => {
    beforeEach(() => {
      getInputSpy = jest.spyOn(core, 'getInput');
      setOutputSpy = jest.spyOn(core, 'setOutput');
      getVersionChangelogSpy = jest.spyOn(
        getVersionChangelogModule,
        'getVersionChangelog'
      );
      inputs = {
        operation: 'read',
        'path-to-changelog': './CHANGELOG.MD',
        version: '1.0.0'
      };

      getInputSpy.mockImplementation((name: string): string => {
        return inputs[name];
      });
      getVersionChangelogSpy.mockImplementation(() => {
        return '# Changelog';
      });
    });

    it('should call getVersionChangelog with valid params', async () => {
      await runAction();

      expect(getVersionChangelogSpy).toBeCalledWith('./CHANGELOG.MD', '1.0.0');
    });

    it('should set markdown output', async () => {
      await runAction();

      expect(setOutputSpy).toBeCalledWith('changelog', '# Changelog');
    });
  });

  describe('when operation is not supported', () => {
    beforeEach(() => {
      getInputSpy = jest.spyOn(core, 'getInput');
      setFailedSpy = jest.spyOn(core, 'setFailed');
      inputs = {
        operation: 'wrong-operation'
      };

      getInputSpy.mockImplementation((name: string): string => {
        return inputs[name];
      });
    });

    it('should call setFailed with valid params', async () => {
      await runAction();

      expect(setFailedSpy).toBeCalledWith(
        'Operation wrong-operation not supported'
      );
    });
  });
});
