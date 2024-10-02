import Configuration, { StrategyOption } from 'interfaces/configuration';

export class ConfigurationDouble implements Configuration {
  public get fileStrategyMapping(): Record<string, StrategyOption> {
    return {};
  }

  static getInstance() {
    return new ConfigurationDouble();
  }

  private _strategy!: StrategyOption;
  private _match!: RegExp;
  private _replace!: string;

  public get strategy(): StrategyOption {
    return this._strategy;
  }

  public get match(): RegExp {
    return this._match;
  }

  public get replace(): string {
    return this._replace;
  }

  withStrategy(strategy: StrategyOption) {
    this._strategy = strategy;
    return this;
  }

  withInvalidStrategy() {
    this._strategy = '88' as StrategyOption;
    return this;
  }

  withMatch(match: RegExp) {
    this._match = match;
    return this;
  }

  withReplace(replace: string) {
    this._replace = replace;
    return this;
  }
}
