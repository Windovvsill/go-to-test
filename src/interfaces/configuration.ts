export const enum StrategyOption {
  MAVEN = 'maven',
  MAVEN_LIKE = 'maven-like',
  RUBY = 'ruby',
  SAME_DIRECTORY = 'same-directory',
  __TESTS__ = '__tests__',
  CUSTOM = 'custom',
  UNKNOWN = 'unknown'
}

export default interface Configuration {
  readonly strategy: StrategyOption;
  readonly fileStrategyMapping: Record<string, StrategyOption>;
  readonly match: RegExp;
  readonly replace: string;
}
