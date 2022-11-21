# My NFT Marketplace

## Requirements

- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to install it with `npm`

## Usage

###### Installation

```
yarn install
```

###### Start standalone localhost development chain (compulsory for local deployment)

```
yarn  start-node
```

###### Deploy contracts (upgradeable deploy)

localhost

```
yarn deploy:local
```

testnet

```
yarn deploy:testnet
```

###### Upgrade contracts

Change contract in `upgradeable/upgrade_contract.js`

localhost

```
yarn upgrade:local
```

testnet

```
yarn upgrade:testnet
```

You can check the deployment status here: <https://testnet-explorer.memescan.io/>

###### Start Frontend

```
yarn dev
```