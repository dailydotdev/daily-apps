# @daily/services

Typescript library with clients for interaction with Daily's backend services.
The library encapsulates the http requests to simple methods and defines relevant types to make it easy to use.

## Technology

* Yarn for managing dependencies.
* Node v10.12.0 (a `.nvmrc` is presented for [nvm](https://github.com/nvm-sh/nvm) users).
* [Jest](https://jestjs.io/) for writing tests.
* Typescript for coding

## Project structure

The project was bootstrapped with vue cli so it is very much like any other vue project but just to make sure.
* `src` - Source files of the project, basically there is one class for one domain (for example content domain and monetization domain)
* `__tests__` - There you can find all the tests and fixtures, we create a file per class so it should be pretty easy to find your way there.
* `lib` - Auto generated folder with the compilation output.

## Tests

With `yarn test` you can run the test suites of the project to make sure everything is running correctly.
You can even use `yarn test --watch` if you want to run the tests related to the modification you just made, recommended for development.

## Build

`yarn build` builds once the project and `yarn watch` builds continously the project when files change.
The output can be found in `lib` folder.
