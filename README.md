<div align="center">
  <h1>Daily Apps</h1>
  <strong>Everything you see on Daily 👀</strong>
</div>
<br>
<p align="center">
  <a href="https://circleci.com/gh/dailynowco/daily-apps">
    <img src="https://img.shields.io/circleci/build/github/dailynowco/daily-apps/master.svg" alt="Build Status">
  </a>
  <a href="https://github.com/dailynowco/daily-apps/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/dailynowco/daily-apps.svg" alt="License">
  </a>
  <a href="https://stackshare.io/daily/daily">
    <img src="http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare">
  </a>
</p>

This is a monorepo with most of Daily's frontend projects. It was created as part of Daily 2.0 refactor to separate concerns to different standalone projects. The main concept of the refactor was to enable others use Daily style guidelines in their applications as well. The monorepo is managed with [lerna](https://github.com/lerna/lerna).

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
* Change working directory to extension project `cd packages/extension`
* Build Firefox version `yarn build:firefox`
* Firefox build should be located at `dist`

