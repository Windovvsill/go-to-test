import { ExtensionContext } from 'interfaces/disposable';
import System from 'interfaces/system';
import UserInterface from 'interfaces/user-interface';
import Configuration, { StrategyOption } from 'interfaces/configuration';
import Strategy from 'interfaces/strategy';
import MavenStrategy from 'strategies/maven-strategy';
import MavenLikeStrategy from 'strategies/maven-like-strategy';
import RubyStrategy from 'strategies/ruby-strategy';
import SameDirectoryStrategy from 'strategies/same-directory-strategy';
import UUTestsUUStrategy from 'strategies/__tests__-strategy';
import CustomStrategy from 'strategies/custom-strategy';
// import * as vscode from 'vscode';

export default class GoToTest {
  private strategies: Map<StrategyOption, Strategy>;
  // private channel = vscode.window.createOutputChannel('Go To Test');

  public constructor(
    private system: System,
    private ui: UserInterface,
    private configuration: Configuration,
    private window: any
  ) {
    this.strategies = new Map<StrategyOption, Strategy>([
      [StrategyOption.MAVEN, MavenStrategy.getInstance()],
      [StrategyOption.MAVEN_LIKE, MavenLikeStrategy.getInstance()],
      [StrategyOption.RUBY, RubyStrategy.getInstance()],
      [StrategyOption.SAME_DIRECTORY, SameDirectoryStrategy.getInstance()],
      [StrategyOption.__TESTS__, UUTestsUUStrategy.getInstance()],
      [StrategyOption.CUSTOM, CustomStrategy.getInstance(configuration)]
    ]);
  }

  public activate(context: ExtensionContext) {
    const disposable = this.registerTheCommand();
    context.subscriptions.push(disposable);
  }

  private registerTheCommand() {
    return this.system.registerCommand('danyg-go-to-test.goToTest', this.executeCommand.bind(this));
  }

  private async executeCommand(): Promise<void> {
    try {
      const currentFile = this.system.getActiveTextEditorFilePath();
      if (null !== currentFile) {
        const testFilePath = this.getTestFilePath(currentFile);
        if (!(await this.handleFileExistence(testFilePath))) return;
        await this.system.openFileInEditor(testFilePath);
      }
    } catch (e) {
      // this.channel.appendLine(e?.toString());
      this.ui.alertUserOfError(e);
    }
  }

  private async handleFileExistence(testFilePath: string) {
    const fileExists = await this.system.fileExists(testFilePath);
    if (fileExists) return true;

    const answer =
      this.window &&
      (await this.window.showInformationMessage(
        `Do you want to create the test file ${testFilePath}`,
        'Yes',
        'No'
      ));

    if (answer === 'Yes') {
      await this.system.createFile(testFilePath);
    }

    return answer === 'Yes';
  }

  private getCurrentStrategy(srcFilePath: string): Strategy {
    const extension = srcFilePath.split('.').pop();
    // this.channel.appendLine(`File extension is ${extension}`);

    if (extension) {
      // this.channel.appendLine(
      //   `Looking at mapping config: ${JSON.stringify(this.configuration.fileStrategyMapping)}`
      // );
      // this.channel.appendLine(
      //   `Looking at mapping config2: ${JSON.stringify(
      //     this.configuration.fileStrategyMapping[extension] // ruby
      //   )}`
      // );
      const strat = this.strategies.get(this.configuration.fileStrategyMapping[extension]);
      if (strat) {
        // this.channel.appendLine(`Using a mapping config: ${strat}`);
        return strat;
      }
    }

    const strategy = this.strategies.get(this.configuration.strategy);

    if (strategy) {
      // this.channel.appendLine(`Using the default strategy`);
      return strategy;
    }

    throw new Error('The given value on settings.json for "go-to-test.strategy" is INVALID.');
  }

  private getTestFilePath(srcFilePath: string): string {
    return this.getCurrentStrategy(srcFilePath).resolve(srcFilePath);
  }
}
