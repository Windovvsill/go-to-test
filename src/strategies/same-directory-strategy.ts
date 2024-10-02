import Strategy from 'interfaces/strategy';

const testPattern = /^(?<filePath>.*)\.spec\.(?<ext>[^\.]+)$/;
const sourcePattern = /^(?<filePath>.*)\.(?<ext>[^\.]+)$/;

const sourceTemplate = '$<filePath>.$<ext>';
const testTemplate = '$<filePath>.spec.$<ext>';

export default class SameDirectoryStrategy implements Strategy {
  public static getInstance() {
    return new SameDirectoryStrategy();
  }

  resolve(filePath: string): string {
    if (filePath.match(testPattern)) {
      return filePath.replace(testPattern, sourceTemplate);
    }
    return filePath.replace(sourcePattern, testTemplate);
  }
}
