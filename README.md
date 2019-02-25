# Wobbly [![Build Status](https://travis-ci.com/Wobbly-App/wobbly-frontend.svg?branch=develop)](https://travis-ci.com/Wobbly-App/wobbly-frontend) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Wobbly-App/wobbly-frontend)](https://dependabot.com) [![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

Wobbly is an app for workplace organizing. See [wobbly.app](https://wobbly.app) for more details.

* [Code of conduct](CODE-OF-CONDUCT.md)
* [Contributing guide](CONTRIBUTING.md)

## 💻 From 0 to Wobbly
* [Install yarn](https://yarnpkg.com/en/docs/install). Yarn is the package manager we use.
* Install TypeScript and Expo: `yarn global add typescript expo-cli`
* Clone this repo: `git clone git@github.com:Wobbly-App/wobbly-frontend.git`
* `cd` into the repo and run `yarn install` to get dependencies
* Run `yarn codegen` to automatically generate the TypeScript typings for our GraphQL client
* Run `yarn start`. You can preview and live reload the app in an Android/iOS emulator or on your device using the Expo app.

## 🌐 Connecting to the backend
Our [backend](https://github.com/Wobbly-App/graphql-backend) exposes a GraphQL API. In `App.tsx`, set the IP of the backend stack you want to connect to.

## ⚙️ Frameworks
* [Expo](https://expo.io)
* [TypeScript](https://www.typescriptlang.org/) and [TSLint](https://palantir.github.io/tslint/)
* [Apollo](https://www.apollographql.com/) for state management
* [Formik](https://jaredpalmer.com/formik) for forms
* [React Navigation](https://reactnavigation.org/) for navigation/routing

## 🧠 Useful tutorials
* [Atomic design](http://bradfrost.com/blog/post/atomic-web-design/)
* [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* [React Native tutorial](https://facebook.github.io/react-native/docs/tutorial)


## 👩‍👩‍👧‍👦 Contributors

Thanks goes to these people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1309951?v=4" width="100px;" alt="Tao Bror Bojlén"/><br /><sub><b>Tao Bror Bojlén</b></sub>](https://btao.org)<br />[💻](https://github.com/Wobbly-App/wobbly-frontend/commits?author=brortao "Code") [🚇](#infra-brortao "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-brortao "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/38507954?v=4" width="100px;" alt="John Evans"/><br /><sub><b>John Evans</b></sub>](http://bananananaba.com)<br />[🖋](#content-King-Mob "Content") [💼](#business-King-Mob "Business development") [🤔](#ideas-King-Mob "Ideas, Planning, & Feedback") [👀](#review-King-Mob "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/361391?v=4" width="100px;" alt="Chris Devereux"/><br /><sub><b>Chris Devereux</b></sub>](http://coderwall.com/chrisdevereux)<br />[💻](https://github.com/Wobbly-App/wobbly-frontend/commits?author=chrisdevereux "Code") [⚠️](https://github.com/Wobbly-App/wobbly-frontend/commits?author=chrisdevereux "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

🖤 🐈
