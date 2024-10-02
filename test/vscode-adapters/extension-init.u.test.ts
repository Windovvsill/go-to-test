import * as expect from 'expect';
import { instance, mock, when } from 'ts-mockito';
import { ExtensionContext } from 'vscode';
import { URI } from 'vscode-uri';
import { buildExtension } from 'vscode-adapters/extension-init';
import { GoToTestVsCodeNS } from 'vscode-adapters/types';
import { VSCodeNSHandler } from 'test-helpers/mocks/vscode-ns-handler';

describe('buildExtension', () => {
  let vscodeNSHandler: VSCodeNSHandler;
  let vscodeNSMock: GoToTestVsCodeNS;
  let extensionContextMock: ExtensionContext;

  beforeEach(() => {
    vscodeNSHandler = new VSCodeNSHandler();
    vscodeNSMock = vscodeNSHandler.getNS();
    extensionContextMock = mock<ExtensionContext>();
    when(extensionContextMock.subscriptions).thenReturn([]);
  });

  it('should return activate and it should be a function', () => {
    const extension = buildExtension(vscodeNSMock);

    expect(extension.activate).toBeInstanceOf(Function);
  });

  function testStrategy({
    strategy,
    actualPath,
    expectedTestPath,
    extraConfig = [],
    extraTitle = ''
  }: {
    strategy: string;
    actualPath: string;
    expectedTestPath: string;
    extraConfig?: Array<[string, string]>;
    extraTitle?: string;
  }) {
    it(`should go to test from a source file [happy path] [Strategy: ${strategy}] ${extraTitle}`, async () => {
      vscodeNSHandler
        // Active Editor
        .withActiveEditor(actualPath)
        .withExistantFilePath(expectedTestPath)
        // Config
        .withConfig(
          new Map<string, string>([['goToTest.strategy', strategy], ...extraConfig])
        );

      When.extensionIsBuilt();
      await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

      Then.openedDocumentPathIs(expectedTestPath);
    });
  }

  testStrategy({
    strategy: 'maven-like',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: '/home/project/test/core/module/main.test.js'
  });
  testStrategy({
    strategy: 'maven',
    actualPath: '/home/project/src/main/package/Main.java',
    expectedTestPath: '/home/project/src/test/package/MainTest.java'
  });
  testStrategy({
    strategy: 'ruby',
    actualPath: '/app/models/model.rb',
    expectedTestPath: '/spec/models/model_spec.rb'
  });
  testStrategy({
    strategy: 'same-directory',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: '/home/project/src/core/module/main.spec.js'
  });
  testStrategy({
    strategy: '__tests__',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: '/home/project/src/core/module/__tests__/main.js'
  });
  testStrategy({
    strategy: 'custom',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: '/home/project/theTests/core/module/main.js',
    extraConfig: [
      ['goToTest.match', '/(.*)src(.*)/'],
      ['goToTest.replace', '/$1theTests$2/']
    ],
    extraTitle: '[with config] '
  });
  testStrategy({
    strategy: 'custom',
    actualPath: '/home/project/src/core/module/main.js',
    expectedTestPath: '/home/project/test/core/module/main.spec.js'
  });

  it(`should advice the user of an error in the configuration When wrong strategy [sad path]`, async () => {
    vscodeNSHandler
      .withShowErrorMessageNeverResolved()
      // Active Editor
      .withActiveEditor('/home/project/src/core/module/main.js')
      // Config
      .withConfig(
        new Map<string, string>([['goToTest.strategy', 'wrong-strategy']])
      );

    When.extensionIsBuilt();
    await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

    Then.showedErrorMessageIs(
      'Go To Test Extension: The given value on settings.json for "go-to-test.strategy" is INVALID.'
    );
  });

  it(`should advice the user of an error in the configuration When missing strategy config [sad path]`, async () => {
    vscodeNSHandler
      .withShowErrorMessageNeverResolved()
      // Active Editor
      .withActiveEditor('/home/project/src/core/module/main.js')
      // Config
      .withConfig(new Map<string, string>([]));

    When.extensionIsBuilt();
    await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

    Then.showedErrorMessageIs(
      'Go To Test Extension: The given value on settings.json for "go-to-test.strategy" is INVALID.'
    );
  });

  it.only(`should create the test file when it does not exists [happy path]`, async () => {
    const expectedTestPath = '/home/project/test/core/module/main.test.js';
    vscodeNSHandler
      // Active Editor
      .withActiveEditor('/home/project/src/core/module/main.js')
      .withNotExistantFilePath(expectedTestPath)
      // Config
      .withConfig(
        new Map<string, string>([['goToTest.strategy', 'maven-like']])
      );

    When.extensionIsBuilt();
    await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

    Then.openedDocumentPathIs(expectedTestPath);
    Then.createdFileIs(expectedTestPath);
  });

  it(`should NOT create the test file when it does exists [happy path]`, async () => {
    const expectedTestPath = '/home/project/test/core/module/main.test.js';
    vscodeNSHandler
      // Active Editor
      .withActiveEditor('/home/project/src/core/module/main.js')
      .withExistantFilePath(expectedTestPath)
      // Config
      .withConfig(
        new Map<string, string>([['goToTest.strategy', 'maven-like']])
      );

    When.extensionIsBuilt();
    await vscodeNSHandler.triggerVSCodeCommand('danyg-go-to-test.goToTest');

    Then.openedDocumentPathIs(expectedTestPath);
    Then.noFileWasCreated();
  });

  const When = {
    extensionIsBuilt() {
      const extension = buildExtension(vscodeNSMock);
      extension.activate(instance(extensionContextMock));
      return extension;
    }
  };

  const Then = {
    openedDocumentPathIs(expectedTestPath: string) {
      const openTextDocArgs = vscodeNSHandler.captureOpenTextDocument().last();
      const uriUsed: URI = openTextDocArgs[0] as URI;
      expect(uriUsed.path).toBe(expectedTestPath);
    },

    showedErrorMessageIs(expectedErrorMessage: string) {
      const [message] = vscodeNSHandler.captureShowErrorMessage().last();
      expect(message).toBeDefined();
      expect(message).toEqual(expectedErrorMessage);
    },

    createdFileIs(expectedCreatedFilePath: string) {
      const actualCreatedFileUrl = vscodeNSHandler.getLastCreatedFile();
      const expectedCreatedFileUrl = URI.file(expectedCreatedFilePath);

      expect(actualCreatedFileUrl.path).toEqual(expectedCreatedFileUrl.path);
    },

    noFileWasCreated() {
      vscodeNSHandler.assertNoFileCreated();
    }
  };
});
