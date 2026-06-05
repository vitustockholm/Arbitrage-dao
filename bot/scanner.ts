import { ethers } from "ethers";
import { CONFIG } from "./config";
import { PairState } from "./types";

const provider = new ethers.JsonRpcProvider(
  process.env.MAINNET_RPC_URL || ""
);

const FACTORY_ABI = [
  "function getPair(address tokenA,address tokenB) external view returns (address pair)"
];

const PAIR_ABI = [
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function getReserves() external view returns (uint112 reserve0,uint112 reserve1,uint32 blockTimestampLast)"
];

export async function getPairAddress(
  factory: string,
  tokenA: string,
  tokenB: string
) {
  const contract = new ethers.Contract(
    factory,
    FACTORY_ABI,
    provider
  );

  return contract.getPair(tokenA, tokenB);
}

export async function getPairState(
  dex: "uniswapV2" | "sushiswap",
  pairAddress: string
): Promise<PairState> {
  const pair = new ethers.Contract(
    pairAddress,
    PAIR_ABI,
    provider
  );

  const [token0, token1, reserves] = await Promise.all([
    pair.token0(),
    pair.token1(),
    pair.getReserves(),
  ]);

  return {
    dex,
    pair: pairAddress,
    token0,
    token1,
    reserve0: reserves[0],
    reserve1: reserves[1],
  };
}

async function main() {
  const pair = await getPairAddress(
    CONFIG.dex.uniswapV2Factory,
    CONFIG.tokens.WETH,
    CONFIG.tokens.USDC
  );

  console.log("Pair:", pair);
}

main().catch(console.error);
