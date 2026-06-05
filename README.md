# Arbitrage DAO

Advanced MEV / Flashloan / DEX Arbitrage research framework.

## Stack

- Solidity 0.8.24
- Hardhat
- TypeScript
- Aave V3 Flashloans
- UniswapV2 / SushiSwap
- Flashbots Bundles
- Mempool Backrun Simulation

## Features

- Flashloan arbitrage executor
- Reserve simulation
- Dynamic gas accounting
- Mempool-triggered execution
- Backrun bundle architecture
- Profit optimization engine
- Coinbase tip support

## Safety

This repository is for lawful research, simulation, testing, and private execution of arbitrage/backrun strategies. Do not use it for theft, oracle manipulation, phishing, malicious sandwiching, or exploiting users.

## Setup

```bash
npm install
cp .env.example .env
npx hardhat compile
npm run scan
```
