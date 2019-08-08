# @daily/extension

Daily 2.0 browser extension

## Technology

* Yarn for managing dependencies.
* Node v10.12.0 (a `.nvmrc` is presented for [nvm](https://github.com/nvm-sh/nvm) users).
* [Jest](https://jestjs.io/) for writing tests.
* Postcss for writing styles.

## Project structure

The project was bootstrapped with vue cli so it is very much like any other vue project but just to make sure.
* `src` - This is obviously the place where you can find the source files.
  * `src/common` - Services and utilities that are used across the project are placed here.
  * `src/components` - In-page or general purpose components are placed here.
  * `src/manifest` - Per-browser extension manifest, used during build to generate the correct one
  * `src/routes` - The different pages of the application, used by vue-router.
  * `src/standalone` - Entry point of the extension.
  * `src/store` - Vuex related files should be placed here, plugins, modules, everything.
  * `src/svg` - Colorful logos of different companies and products to be used in Daily products (svg format).
* `__tests__` - There you can find all the tests and fixtures, we create a file per component so it should be pretty easy to find your way there.
* `public` - Directory for serving static files and assets.

## Tests

With `yarn test` you can run the test suites of the project to make sure everything is running correctly.
You can even use `yarn test --watch` if you want to run the tests related to the modification you just made, recommended for development.

## Build / Serve

#### Development

For development it is recommended to use `yarn serve` as it uses the development version and updates on every file change. This command outputs the app to `dist` folder only but this is enough for local development.

For loading the unpacked version please look [at this guide for Chrome](https://developer.chrome.com/extensions/getstarted) and [this guide for Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Temporary_Installation_in_Firefox). Both cases should point to `dist` folder.

**Please make sure you have a local environment of Daily services up and running with seed data, otherwise you won't see any data in your local version. For more information, [click here](https://github.com/dailynowco/daily#setting-up-local-environment).**

#### Production

`yarn build:chrome` builds a production ready extension for Google Chrome, while `yarn build:firefox` does the same for Mozilla's Firefox. Both output the app to `dist` folder and a zip version of the app to `dist-zip`, ready for publishing to the store. If you want to immediately build for all platforms and also zip the source files (required for firefox review) just use `yarn build:all`.
