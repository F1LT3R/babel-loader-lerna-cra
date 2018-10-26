# babel-loader-lerna-cra

> Transpile Create-React-App imports in Lerna projects.

This package overrides the Webpack configuration of Create-React-App projects in a Lerna repo.

## ⚠️ Please Note

As with packages like [React-App-Rewired]...

Using `babel-loader-lerna-cra` breaks the "guarantees" that Create React App provides. That is to say, you now "own" the configs. No support will be provided. Proceed with caution.

**"Stuff can break**" — Dan Abramov https://twitter.com/dan_abramov/status/1045809734069170176

## The Problem

Many people are trying to use Create-React-App in a Lerna repo with a project structure similar to this:

```shell
my-lerna-project/
├── lerna.json
├── package.json
└── packages
    ├── comp-a
    ├── comp-b
    ├── my-react-app-1
    │   └── comp-a
    └── my-react-app-2
        ├── comp-a
        └── comp-b
```


When running the React App, errors like these show up:

```
Error: You may need an appropriate loader to handle this file.
```

```shell
Failed to compile.

../comp-button/src/index.js
SyntaxError: .../monorepo-react/packages/comp-button/src/index.js: Unexpected token (4:4)

  2 |
  3 | const Button = ({ type = 'button', children, onClick }) => (
> 4 |     <div>
    |     ^
  5 |       <button type={type} className="button" onClick={onClick}>
  6 |         {children}
  7 |       </button>
```

These errors show up because the Webpack config in your Create-React-App does not look outside the React App's `./src` directory for additional import dirs. In fact, how could it? It has no idea how you would configure your monorepo.

## The Solution

This module (`babel-loader-lerna-cra`) allows you to configure Webpack config overrides in your Lerna project's `package.json` file; allowing babel to transpile imported Lerna packages using `dev` and `prod`.

## Usage

1. Install `babel-loader-lerna-cra` in your Lerna repo:

    ```shell
    npm i -D babel-loader-lerna-cra
    ```

2. Configure the `package.json` in your Lerna root:

    ```json
    {
        "name": "root",
        "private": true,
        "devDependencies": {
            "babel-learna-loader-cra": "*"
        },
        "babel-loader-lerna-cra": {
            "imports": "packages/comp-*/src",
            "apps":  "packages/*react-app*"
        }
    }
    ```

    - `imports` - glob pattern for imports that require transpiling
    - `apps` - glob pattern for app that need overriding

3. Boostrap your React Apps with Webpack overrides:

    Note: you **MUST** complete step two first.

    ```shell
    npx babel-loader-lerna-cra
    ```

    You should see this output:

    ```shell
    babel-lerna-loader-cra: bootstraping...
    babel-lerna-loader-cra: config = {
      lernaRoot: '../monorepo-react',
      settings: {
        imports: 'packages/comp-*/src',
        apps: 'packages/*react-app*'
      },
      apps: [
        '../packages/my-react-app-1',
        '../packages/my-react-app-2'
      ],
      imports: [
        '../packages/comp-a/src',
        '../packages/comp-a/src',
        '../packages/comp-b/src'
        ]
    }
    babel-lerna-loader-cra: copying: my-react-app-1/... webpack.config.dev.js => backup.webpack.config.prod.js
    babel-lerna-loader-cra: copying: my-react-app-1/... webpack.config.replacement.js => webpack.config.dev.js
    babel-lerna-loader-cra: copying: my-react-app-1/... webpack.config.prod.js => backup.webpack.config.prod.js
    babel-lerna-loader-cra: copying: my-react-app-1/... webpack.config.replacement.js => webpack.config.prod.js
    babel-lerna-loader-cra: copying: my-react-app-2/... webpack.config.dev.js => backup.webpack.config.prod.js
    babel-lerna-loader-cra: copying: my-react-app-2/... webpack.config.replacement.js => webpack.config.dev.js
    babel-lerna-loader-cra: copying: my-react-app-2/... webpack.config.prod.js => backup.webpack.config.prod.js
    babel-lerna-loader-cra: copying: my-react-app-2/... webpack.config.replacement.js => webpack.config.prod.js
    ```

    Note: you will need to bootstrap again when: 
    
    1. Installing packages in CI
    2. When a new create-react-app is added

## Related issues

- https://github.com/babel/babel-loader/issues/377
- https://github.com/facebook/create-react-app/issues/4161
- https://github.com/facebook/create-react-app/issues/1333

[React-App-Rewired]: https://github.com/timarney/react-app-rewired "React App Reqired"