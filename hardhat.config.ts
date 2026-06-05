import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const forkUrl =
  process.env.ARB_MAINNET_RPC_URL ||
  process.env.MAINNET_RPC_URL ||
  "";

const shouldFork = forkUrl.length > 0 && process.env.NO_FORK !== "true";

const accounts = process.env.SEARCHER_KEY
  ? [process.env.SEARCHER_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: shouldFork
      ? {
          chainId: 42161,
          forking: {
            url: forkUrl,
          },
        }
      : {
          chainId: 31337,
        },
    arbitrum: {
      url: process.env.ARB_MAINNET_RPC_URL || "",
      chainId: 42161,
      accounts,
    },
    arbitrumSepolia: {
      url: process.env.ARB_SEPOLIA_RPC_URL || "",
      chainId: 421614,
      accounts,
    },
  },
};

export default config;
