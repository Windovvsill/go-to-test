import Strategy from 'interfaces/strategy';

const sourcePattern = /^(?<projectPath>.*)app(?<moduleInternalPath>.*)\.(?<ext>[^\.]+)$/;
const testPattern = /^(?<projectPath>.*)spec(?<moduleInternalPath>.*)_spec\.(?<ext>[^\.]+)$/;

const sourceTemplate = '$<projectPath>app$<moduleInternalPath>.$<ext>';
const testTemplate = '$<projectPath>spec$<moduleInternalPath>_spec.$<ext>';

export default class MavenStrategy implements Strategy {
  public static getInstance() {
    return new MavenStrategy();
  }

  resolve(filePath: string): string {
    if (filePath.match(testPattern)) {
      return filePath.replace(testPattern, sourceTemplate);
    }
    return filePath.replace(sourcePattern, testTemplate);
  }
}
