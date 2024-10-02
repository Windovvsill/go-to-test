import { verify, instance, anyOfClass, capture, resetCalls } from 'ts-mockito';
import * as expect from 'expect';
import GoToTest from 'core/go-to-test';
import UserInterface from 'interfaces/user-interface';
import { ExtensionContext } from 'interfaces/disposable';
import Configuration, { StrategyOption } from 'interfaces/configuration';
import UIMock from './mocks/ui-mock';
import SystemDouble from './mocks/system-double';
import { ConfigurationDouble } from './mocks/configuration-double';
import { WindowDouble } from './mocks/window-double';

export const defaultConfiguration = ConfigurationDouble.getInstance().withStrategy(
  StrategyOption.MAVEN_LIKE
);

// function
export class TestBuilder {
  public static build() {
    const test = new TestBuilder();
    return {
      given: test,
      when: test,
      then: test,
      util: test
    };
  }

  private testSubject!: GoToTest;
  private system!: SystemDouble;
  private ui!: UserInterface;
  private context!: ExtensionContext;

  private constructor() {}

  get and() {
    return this;
  }

  private buildTestSubject(
    configuration: Configuration = defaultConfiguration,
    window = new WindowDouble(true)
  ) {
    resetCalls(UIMock);
    this.system = new SystemDouble();
    this.ui = instance(UIMock);
    this.testSubject = new GoToTest(this.system, this.ui, configuration, window);
  }

  private getContextDouble(): ExtensionContext {
    return {
      subscriptions: []
    };
  }

  // Given
  public anyConfiguration() {
    this.buildTestSubject();
    this.context = this.getContextDouble();

    this.testSubject.activate(this.context);

    return this;
  }

  public theFollowingConfiguration(configuration: Configuration) {
    this.buildTestSubject(configuration);
    this.context = this.getContextDouble();

    this.testSubject.activate(this.context);

    return this;
  }

  public theUserOpens(sourceFilePath: string) {
    this.system.__On_getActiveTextEditorFilePath(sourceFilePath);
    return this;
  }

  public theFile(filePath: string) {
    return {
      doesNotExists: () => {
        this.system.__Tag_File_As_Not_Existant(filePath);

        return this;
      }
    };
  }

  public theUserHaveNotOpenedAnyFileYet() {
    this.system.__On_getActiveTextEditorFilePath(null);
    return this;
  }

  // When
  public async goToTestIsActioned() {
    await this.system.__ExecuteCommand('danyg-go-to-test.goToTest');
  }

  // Then
  public theTestFile(expectedFilePath: string) {
    const semantics = {
      isOpened: () => {
        const openedFile = this.system.__Get_OpenedFilePath();
        expect(openedFile).toEqual(expectedFilePath);

        return semantics;
      },

      isCreated: () => {
        this.system.__Assert_createFile_Was_Called();
        const createdFile = this.system.__Get_CreatedFilePath();
        expect(createdFile).toEqual(expectedFilePath);

        return semantics;
      },

      isNotCreated: () => {
        const createdFile = this.system.__Get_CreatedFilePath();
        expect(createdFile).not.toEqual(expectedFilePath);

        return semantics;
      },

      get and() {
        return semantics;
      }
    };

    return semantics;
  }

  public nothingIsDone() {
    expect(this.system.__IS_NOT_OpenedFilePath()).toBe(true);

    return this;
  }

  public userIsInformedAboutAnError() {
    verify(UIMock.alertUserOfError(anyOfClass(Error))).once();

    return this;
  }

  // Other Helpers
  public getAlertUserOfErrorLastArgument(): Error {
    const [error] = capture(UIMock.alertUserOfError).last();
    return error;
  }
}
