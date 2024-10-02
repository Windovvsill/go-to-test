import Configuration, { StrategyOption } from 'interfaces/configuration';
import { GetConfigurationFn, GoToTestVsCodeNS } from './types';

const SECTIONS = {
  STRATEGY: 'goToTest.strategy',
  MATCH: 'goToTest.match',
  REPLACE: 'goToTest.replace',
  FILE_STRATEGY_MAPPING: 'goToTest.fileStrategyMapping'
};

const strategyConfigToStrategyOption = new Map<string, StrategyOption>([
  ['maven-like', StrategyOption.MAVEN_LIKE],
  ['ruby', StrategyOption.RUBY],
  ['maven', StrategyOption.MAVEN],
  ['same-directory', StrategyOption.SAME_DIRECTORY],
  ['__tests__', StrategyOption.__TESTS__],
  ['custom', StrategyOption.CUSTOM]
]);

export default class VSCodeConfiguration implements Configuration {
  public static getInstance(vscode: GoToTestVsCodeNS) {
    return new VSCodeConfiguration(vscode.workspace.getConfiguration);
  }
  public static SECTIONS = SECTIONS;

  private constructor(private getConfiguration: GetConfigurationFn) {}

  public get strategy(): StrategyOption {
    const defaultValue = StrategyOption.UNKNOWN;

    const strategyConfig = this.getConfiguration().get(SECTIONS.STRATEGY) as string;
    return strategyConfigToStrategyOption.get(strategyConfig) ?? defaultValue;
  }

  public get fileStrategyMapping(): Record<string, StrategyOption> {
    const strategyConfig = this.getConfiguration().get(SECTIONS.FILE_STRATEGY_MAPPING) as Record<
      string,
      StrategyOption
    >;

    // vscode.window
    //   .createOutputChannel('Go To Test Init')
    //   .appendLine(`Loading config: ${Object.entries(strategyConfig)}`);
    return strategyConfig || {};
  }

  public get match(): RegExp {
    const defaultValue = /^(?<projectPath>.*)src(?<moduleInternalPath>.*)\.(?<ext>[tj]sx?)$/;
    if (!this.getConfiguration().get(SECTIONS.MATCH)) {
      return defaultValue;
    }
    return new RegExp(this.getConfiguration().get(SECTIONS.MATCH) as string);
  }

  public get replace(): string {
    return this.getConfiguration().get(SECTIONS.REPLACE) ?? '$1test$2.spec.$3';
  }
}
