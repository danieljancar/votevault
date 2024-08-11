<div align="center">
    <img src="assets/brand/vv-logo-m.webp" width="250" height="250" alt="VoteVault Logo">
    <h1>VoteVault</h1>
    <p>A open-source, blockchain-based voting platform built with Stellar Smart Contracts.</p>
</div>

<div align="center">

[![Stellar](https://img.shields.io/badge/Stellar-07B5E5?logo=stellar)](https://stellar.org)
[![Nx Workspace](https://img.shields.io/badge/Nx-143055?logo=nx)](https://nx.dev/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Linter](https://github.com/danieljancar/votevault/actions/workflows/lint.yml/badge.svg)](https://github.com/danieljancar/votevault/actions/workflows/lint.yml)
[![Formatting](https://github.com/danieljancar/votevault/actions/workflows/format.yml/badge.svg)](https://github.com/danieljancar/votevault/actions/workflows/format.yml)

[![MIT License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

This project is part of the [Stellar Smart Contract Challenge](https://dev.to/challenges/stellar) on [Dev.to](https://dev.to/).

We built a blockchain-based voting platform using Stellar Smart Contracts. VoteVault is a secure and transparent voting platform that allows users to create and participate in voting processes. Find out more about our journey building VoteVault in the [Dev.to post]() or visit the [VoteVault website]().

# Table of Contents

- [Features](#features)
- [Product Evaluation](#product-evaluation)
  - [User Stories](#user-stories)
  - [Use Cases](#use-cases)
  - [Known Issues](#known-issues)
  - [Future Features](#future-features)
- [Contributing](#contributing)
  - [Developer Guidelines and Repository Setup](#developer-guidelines-and-repository-setup)
  - [Development Previews](#development-previews)
- [License](#license)
- [Credits](#credits)
  - [Special Thanks](#special-thanks)
  - [Contributors](#contributors)

# Features

With VoteVault, you can create and participate in secure and transparent voting processes. Here are some of the features of VoteVault:

- **Stellar Smart Contracts**: Ensure secure and verifiable voting through Stellar smart contracts.
- **Angular Frontend**: Enjoy a sleek, responsive user interface designed using Angular, optimized for both desktop and mobile devices, developed with Tailwind CSS.
- **Secure and Transparent**: VoteVault tries to implement secure and transparent voting processes, ensuring the integrity of the voting system.
- **Verifiable Results**: All votes are stored on the Stellar blockchain, allowing for verification of the voting results.

# Product Evaluation

## User Stories

We wrote down some user stories to guide the development of VoteVault. Here are some of the most important ones:

### Authentication

- As a user, I want to be able to register a new Stellar account, so I can participate in the voting process.
- As a user, I want to be able to login to my account, so I can access the voting platform.

### Voting

- As a user, I want to be able to create a new vote, so I can start a voting process.
- As a user, I want to be able to cast my opinion on a vote, so I can participate in the voting process.
- As a user, I want to be able to see the results of a vote, so I can verify the voting process.
- As a user, I want to be able to copy the vote link, so I can share it with others.

### User Experience

- As a user, I want to get feedback on my actions, so I know what is happening.
- As a user relying on accessibility features, I want to be able to use the platform, so I can participate in the voting process.

## Use Cases

VoteVault integrating Stellar Smart Contracts could be used in various scenarios, such as:

- **Company Elections**: Companies could use VoteVault to conduct internal elections, such as electing a new board member.
- **Community Decisions**: Communities could use VoteVault to make decisions on community projects or initiatives.
- **Controversial Opinions**: People could use VoteVault to express their opinions on controversial topics.

Based on this evaluation, the product sets a base source code for enhancing the platform with more features. Such as using VoteVault "core" as a base for a more complex voting system, like government elections with each citizen being registered once (which would kill the anonymity of the votes - _sigh_) or other useful extensions of our application. This provides a real-world use case for the Stellar Smart Contracts and the VoteVault platform.

## Known Issues

As this project was developed in a short amount of time, there are some known issues that we would like to call out and address in the future:

- **Accessibility**: The platform is not fully accessible yet. We tried to implement some accessibility features, but there is still some work to do.
- **Error Handling**: The error handling is not perfect yet, but already pretty good.
- **Protect from Sybil Attacks and improved Authentication**: We need to implement a way to protect the platform better from Sybil and other attacks.

## Future Features

We also got some additional features we thought about and couldn't implement yet.

- **Voting Timeframes**: Users creating a new vote can decide whether there's a start and end date for the votes.
- **Multiple Options**: Users can also create votes where multiple options can be selected.
- **Full Test Coverage**: We want to have full test coverage for the platform.
- **Automated Testing**: We already have implemented some automated testing and linting, also in the `release.yml` action, where the app is automatically deployed. If we add full test coverage, we can also add automated testing to the deployment process (spec and e2e tests).

# Contributing

Contributions are appreciated! If you want to contribute, please read and comply with the [Contributing Guidelines](.github/CONTRIBUTING.md), [Code of Conduct](.github/CODE_OF_CONDUCT.md), and [Developer Certificate of Origin](.github/DCO.md) first.

## Developer Guidelines and Repository Setup

We have several documents for developers to help them get started with the project. You can find them in the `docs` or `.github` directory. Here are some of the most important ones:

- [Contributing Guidelines](.github/CONTRIBUTING.md)
- [Workflow](docs/WORKFLOW.md)
- [Best Practices](docs/BEST_PRACTICES.md)
- [Formatting](docs/FORMATTING.md)
- [Dev Actions](docs/DEV_ACTIONS.md)

We very much suggest you read these documents before contributing to the project, especially the [Contributing Guidelines](.github/CONTRIBUTING.md) and [Workflow](docs/WORKFLOW.md).

# License

This project is licensed under the [MIT License](LICENSE). By contributing to VoteVault, you agree that your contributions will be released under the same license. Also, you agree to the [Contributor Covenant Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Developer Certificate of Origin](.github/DCO.md).

# Credits

## Special Thanks

Thanks to the following projects and their contributors for making VoteVault possible:

- [Stellar](https://stellar.org)
- [Angular](https://angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)

This project was done as part of the [Stellar Smart Contract Challenge](https://dev.to/challenges/stellar) on [Dev.to](https://dev.to/).

## Contributors

Thanks to the following people for their contributions:

[![Contributors](https://contrib.rocks/image?repo=danieljancar/votevault)](https://github.com/danieljancar/votevault/graphs/contributors)

Released under [MIT License](LICENSE) by [@danieljancar](https://github.com/danieljancar) and [@cyrilkurmann](https://github.com/Gr1ll)
