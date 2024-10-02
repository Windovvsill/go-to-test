# Go To Test

![Go To Test CI](https://github.com/danyg/go-to-test/workflows/Go%20To%20Test%20CI/badge.svg)

With this extension, you will be able to go to the test file (or create it) for the current file with the press of a hotkey. Also, go to the source file using the same hotkey.

Available several common test file location strategies. Is recommended to save the test file location strategy in the workspace settings so that it can be shared with your team.

![Go To Test](https://user-images.githubusercontent.com/1834409/177147936-7ac1b70f-a45e-4886-9dfc-9867f2f36146.gif)

![Create test file](https://user-images.githubusercontent.com/1834409/177147978-0b0c8658-e5fb-4ba5-afcf-985d2340a81a.gif)

## Available file location strategies

| Strategy name    | File Paths                                               |             Go to Test              |            Go To Source             |
| ---------------- | -------------------------------------------------------- | :---------------------------------: | :---------------------------------: |
| `same_directory` | `src/feature/file.ts`<br>`src/feature/file.test.ts`      | <span style="color: green">✔</span> | <span style="color: green">✔</span> |
| `__tests__`      | `src/feature/file.ts`<br>`src/feature/__tests__/file.ts` | <span style="color: green">✔</span> | <span style="color: green">✔</span> |
| `maven`          | `src/feature/file.java`<br>`test/feature/fileTest.java`  | <span style="color: green">✔</span> | <span style="color: green">✔</span> |
| `maven-like`     | `src/feature/file.ts`<br>`test/feature/file.test.ts`     | <span style="color: green">✔</span> | <span style="color: green">✔</span> |
| `custom`         | `configurable by regex`                                  | <span style="color: green">✔</span> |  <span style="color: red">✘</span>  |

Use a custom fileStrategyMapping to deploy different strategies per file type.

```
"goToTest.fileStrategyMapping": {
  "rb": "ruby",
  "ts": "same-directory",
  "js": "same-directory",
  "jsx": "same-directory",
  "tsx": "same-directory"
}
```

When the test file is not found it ask if you want to create one

## Features

- Go to test
- Go to source \*
- Creates a test when it doesn't exist
- Custom test location strategy

\*: except for custom strategy.

## Coming soon™ features

- Change suffix (e.g. `.test.` to `.spec.`)
- Confirm on Create file

Check [backlog](https://github.com/danyg/go-to-test/projects/1) for more information

## Build locally

`npm version patch --no-commit --force && vsce package`
