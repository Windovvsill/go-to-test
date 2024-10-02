import { ExtensionContext } from 'interfaces/disposable';
import GoToTest from 'core/go-to-test';
import VsCodeSystem from './vscode-system';
import VSCodeUI from './vscode-ui';
import VSCodeConfiguration from './vscode-configuration';
import { GoToTestVsCodeNS } from './types';

export function buildExtension(
  vscode: GoToTestVsCodeNS
): { activate: (context: ExtensionContext) => void } {
  const goToTestExtension = new GoToTest(
    VsCodeSystem.getInstance(vscode),
    VSCodeUI.getInstance(vscode),
    VSCodeConfiguration.getInstance(vscode),
    vscode.window
  );

  return {
    activate: goToTestExtension.activate.bind(goToTestExtension)
  };
}
