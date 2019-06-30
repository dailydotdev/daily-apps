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

This is a monorepo with most of Daily's frontend projects. It was created as part of Daily 2.0 refactor to separate concerns to different standalone projects. The main concept of the refactor was to enable others use Daily style guidelines in their applications as well. The monorepo is managed with [lerna](https://github.com/lerna/lerna) and based on node v10.12.0.

## Projects

### components

Library which implements Daily's style guidelines.
It mainly contains Vue generic components (such as modals, text boxes and toggles) but also consists of style sheets which define color platte, typography and more.

### services

Typescript library with clients for interaction with Daily's backend services.
The library encapsulates the http requests to simple methods and defines relevant types to make it easy to use. 

### extension

Daily browser extension in its glory, written in Vue and powered by the components and services libraries.
Everything you always wanted to know about the extension can be found here.

### moderator

Internal system for managing the content you see on Daily.
Currently it supports managing only the new source requests from the community.


## Firefox Review

* Install node v10.12.0 and yarn
* Install `lerna` as a global package `yarn global add lerna` 
* Bootstrap project `lerna bootstrap`
* Build project `lerna run build`
* Change working directory to extension project `cd packages/extension`
* Build Firefox version `yarn build:firefox`
* Firefox build should be located at `dist`

