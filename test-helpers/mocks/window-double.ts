export class WindowDouble {
  public constructor(private alwaysYes = true) {}
  public async showInformationMessage(...args: string[]) {
    return this.alwaysYes ? 'Yes' : 'No';
  }
}
