import * as vscode from 'vscode';

class VSCodeConfig {
  public static getInstance() {
    return new VSCodeConfig();
  }

  public async withMavenLikeStrategy() {
    await this.setConfig('goToTest.strategy', 'maven-like');
  }

  public async withMavenStrategy() {
    await this.setConfig('goToTest.strategy', 'maven');
  }

  public async withSameDirectoryStrategy() {
    await this.setConfig('goToTest.strategy', 'same-directory');
  }

  public async withFileStrategyMapping() {
    await this.setConfig('goToTest.fileStrategyMapping', { rb: 'ruby', tsx: 'same-directory' });
  }

  public async withUnderscoreUnderscoreTestsUnderscoreUnderscoreStrategy() {
    await this.setConfig('goToTest.strategy', '__tests__');
  }

  public async withCustomStrategy() {
    await this.setConfig('goToTest.strategy', 'custom');
    return this;
  }

  public async andMatch(match: string) {
    await this.setConfig('goToTest.match', match);
    return this;
  }

  public async andReplace(replace: string) {
    await this.setConfig('goToTest.replace', replace);
    return this;
  }

  private async setConfig(section: string, value: unknown) {
    return vscode.workspace.getConfiguration().update(section, value);
  }
}

export default class VSCode {
  public static getInstance() {
    return new VSCode();
  }

  public isConfigured() {
    return VSCodeConfig.getInstance();
  }
}
