import { StrategyOption } from 'interfaces/configuration';

import { ConfigurationDouble } from 'test-helpers/mocks/configuration-double';
import { TestBuilder } from 'test-helpers/TestBuilder';

describe('Same Directory Strategy', () => {
  it('should use same-directory strategy WHEN the configuration says so', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
      )
      .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.js');

    await when.goToTestIsActioned();

    then.theTestFile('/src/module/sub-module/sub-sub-module/my-file.spec.js').isOpened();
  });

  it('should use same-directory strategy WHEN the configuration says so and it works with Windows Paths', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
      )
      .and.theUserOpens('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\my-file.js');

    await when.goToTestIsActioned();

    then
      .theTestFile('C:\\Project\\src\\module\\sub-module\\sub-sub-module\\my-file.spec.js')
      .isOpened();
  });

  it('should go to source file when user is editing the test file', async () => {
    const { given, when, then } = TestBuilder.build();
    given
      .theFollowingConfiguration(
        ConfigurationDouble.getInstance().withStrategy(StrategyOption.SAME_DIRECTORY)
      )
      .and.theUserOpens('/src/module/sub-module/sub-sub-module/my-file.spec.js');

    await when.goToTestIsActioned();

    then.theTestFile('/src/module/sub-module/sub-sub-module/my-file.js').isOpened();
  });
});
