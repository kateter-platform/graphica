# graphica

A graphical library used for visualising advanced concepts

<img width="302" alt="Group 6" src="https://github.com/kateter-platform/graphica/assets/37273026/73757c15-87f9-4cf2-beb9-e5cb9ccc0322">

![image](https://github.com/kateter-platform/graphica/assets/113468143/f8b31058-b842-446d-b09e-ba57fbed4fbf)

---

You can install the package by following the instructions here: [https://github.com/kateter-platform/graphica/pkgs/npm/graphica](https://github.com/kateter-platform/graphica/pkgs/npm/graphica)

## Getting Started

First, run the development server:

```bash
yarn dev
```

or

```bash
yarn start
```

To run prettier and lint run:

```bash
yarn prettier:fix && yarn lint
```

To build the project with webpack use:

```bash
yarn dist
```

Please note that jsx should be set to react in the tsconfig, and all next files/folders should be removed from the include before building for production.

To publish the project to the registry run

```bash
yarn publish
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
