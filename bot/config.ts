import { ethers } from "ethers";

export const CONFIG = {
  chainId: 1,

  tokens: {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },

  routers: {
    uniswapV2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    sushiswapRouter: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  },

  dex: {
    uniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    sushiswapFactory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
  },

  risk: {
    minNetProfitWei: ethers.parseEther("0.01"),
    flashloanPremiumBps: 5n,
  },
};
