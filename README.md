# Daily Apps

> A monorepo for Daily's frontend projects.

The monorepo is managed by [lerna](https://github.com/lerna/lerna).

### Projects

#### components

Vue library which implements Daily's design guideline and the relevant components
to be used by the different applications.

#### services

Typescript library with clients for interaction with Daily's API.

#### extension

Daily browser extension written in Vue  


### Firefox Review

* Install node v10.12.0 and yarn
* Install `lerna` as a global package `yarn global add lerna` 
* Bootstrap project `lerna bootstrap`
* Build project `lerna run build`
* Firefox build (zip file) should be located at `packages/extension/dist-zip`

