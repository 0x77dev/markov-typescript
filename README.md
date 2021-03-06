# markov-typescript

A Markov Chain library written in TypeScript, inspired by [otac0n/markov](https://www.github.com/otac0n/markov) and [chriscore/MarkovSharp](https://www.github.com/chriscore/MarkovSharp).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```bash
yarn add @0x77/markov-typescript
```

### Usage

Import types from package:

```typescript
import * as Markov from "@0x77/markov-typescript";
```

Code sample

```typescript
const chain = new MarkovChain<string>(2);
chain.learn("the quick brown fox jumped over the lazy dog".split(" "));
chain.learn("the quick brown dog jumped over the lazy cat".split(" "));
chain.learn("the quick brown cat jumped over the lazy fox".split(" "));
for (let x = 0; x < 10; x++) {
  console.log(chain.walk().join(" "));
}
```

## Building the project

```bash
yarn build
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/0x77dev/markov-typescript/tags).

## Authors

- **Tom Wolfe** - _Initial work_ - [trwolfe13](https://github.com/trwolfe13)
- **Mikahil Marynenko** - _Dependencies, package optimizations_ - [0x77dev](https://0x77.page)

See also the list of [contributors](https://github.com/0x77dev/markov-typescript/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- Thanks to [otac0n](https://www.github.com/otac0n) for the original .NET codebase.
- Thanks to [chriscore](https://www.github.com/chriscore) for the second reference and unit tests.
