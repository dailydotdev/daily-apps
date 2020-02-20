# @daily/components

An implementation of Daily's style guide in postcss and Vue.

## Technology

* Yarn for managing dependencies.
* Node v10.12.0 (a `.nvmrc` is presented for [nvm](https://github.com/nvm-sh/nvm) users).
* [Jest](https://jestjs.io/) for writing tests.
* Postcss for writing styles.

## Project structure

The project was bootstrapped with vue cli so it is very much like any other vue project but just to make sure.
* `src` - This is obviously the place where you can find the source files, split to `components` and `styles`.
  * `src/components` - The place where you can find all the vue compponents and any new component should be placed there.
  * `src/styles` - Postcss stylesheets go there, typography, color palette, everything can be found there.
* `__tests__` - There you can find all the tests and fixtures, we create a file per component so it should be pretty easy to find your way there.
* `public` - Directory for serving static files and assets.
* `.storybook` - [storybook][storybook] related configurations.
* `stories` - Stories of Daily [storybook][storybook].
* `logos` - Colorful logos of different companies and products to be used in Daily products (svg format).
* `svg` - Monochrome icons in svg format to be used by [vue-svgicon](https://www.npmjs.com/package/vue-svgicon) that are automatically converted to javascript files, located in `icons` folder.

## Tests

With `yarn test` you can run the test suites of the project to make sure everything is running correctly.
You can even use `yarn test --watch` if you want to run the tests related to the modification you just made, recommended for development.

## Demo

A demo page is available on port 8090 when running `yarn serve`.
The demo shows the different components and styles that can be found in the library.

## Storybook

[Storybook][storybook] provides much easier way to understand the components than the current demo page.
Most components, if not all, are covered with stories.
`yarn storybook` will serve the storybook on port 6006.

Live version: https://storybook.daily.dev


[storybook]: https://storybook.js.org/
