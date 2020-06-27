<div align="center">
  <h1>Daily Apps</h1>
  <strong>Everything you see on Daily 👀</strong>
</div>
<br>
<p align="center">
  <a href="https://circleci.com/gh/dailydotdev/daily-apps">
    <img src="https://img.shields.io/circleci/build/github/dailydotdev/daily-apps/master.svg" alt="Build Status">
  </a>
  <a href="https://github.com/dailydotdev/daily-apps/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/dailydotdev/daily-apps.svg" alt="License">
  </a>
  <a href="https://stackshare.io/daily/daily">
    <img src="http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare">
  </a>
  <a href="https://storybook.daily.dev">
    <img src="https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg" alt="Storybook">
  </a>
</p>

This is a monorepo with most of Daily's frontend projects. It was created as part of Daily 2.0 refactor to separate concerns to different standalone projects. The main concept of the refactor was to enable others use Daily style guidelines in their applications as well.

## Technology

* Yarn for managing dependencies.
* Node v10.21.0 (a `.nvmrc` is presented for [nvm](https://github.com/nvm-sh/nvm) users).
* [lerna](https://github.com/lerna/lerna) for managing the monorepo.

## Projects

### components

Library which implements Daily's style guidelines.
It mainly contains Vue generic components (such as modals, text boxes and toggles) but also consists of style sheets which define color platte, typography and more.
For more information [click here](https://github.com/dailydotdev/daily-apps/tree/master/packages/components).

### services

Typescript library with clients for interaction with Daily's backend services.
The library encapsulates the http requests to simple methods and defines relevant types to make it easy to use.
For more information [click here](https://github.com/dailydotdev/daily-apps/tree/master/packages/services).

### extension

Daily browser extension in its glory, written in Vue and powered by the components and services libraries.
Everything you always wanted to know about the extension can be found here.
For more information [click here](https://github.com/dailydotdev/daily-apps/tree/master/packages/extension).

### moderator

Internal system for managing the content you see on Daily.
Currently it supports managing only the new source requests from the community.

## Want to Help?

So you want to contribute to Daily Apps and make an impact, we are glad to hear it. :heart_eyes:

Before you proceed we have a few guidelines for contribution that will make everything much easier.
We would appreciate if you dedicate the time and read them carefully:
https://github.com/dailydotdev/.github/blob/master/CONTRIBUTING.md

## Bootstrap Project

After cloning the project, please make sure to run the following commands to bootstrap the project:
```
npx lerna bootstrap
npx lerna run build
```

## Firefox Review

* Install node v10.21.0 and yarn
* Install `lerna` as a global package `yarn global add lerna` 
* Bootstrap project `lerna bootstrap`
* Build project `lerna run build`
* Change working directory to extension project `cd packages/extension`
* Build Firefox version `yarn build:firefox`
* Firefox build should be located at `dist`

