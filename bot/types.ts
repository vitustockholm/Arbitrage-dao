export type DexName = "uniswapV2" | "sushiswap";

export type TokenPair = {
  tokenA: string;
  tokenB: string;
  symbolA: string;
  symbolB: string;
};

export type PairState = {
  dex: DexName;
  pair: string;
  token0: string;
  token1: string;
  reserve0: bigint;
  reserve1: bigint;
};
