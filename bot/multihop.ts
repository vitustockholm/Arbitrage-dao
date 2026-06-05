import { PairState } from "./types";

export type Hop = {
  pair: PairState;
  tokenIn: string;
  tokenOut: string;
};

export function amountOutV2(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): bigint {
  if (amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) {
    return 0n;
  }

  const amountInWithFee = amountIn * 997n;

  return (
    (amountInWithFee * reserveOut) /
    (reserveIn * 1000n + amountInWithFee)
  );
}

export function quoteHop(
  amountIn: bigint,
  hop: Hop
): bigint {
  const token0 = hop.pair.token0.toLowerCase();

  if (hop.tokenIn.toLowerCase() === token0) {
    return amountOutV2(
      amountIn,
      hop.pair.reserve0,
      hop.pair.reserve1
    );
  }

  return amountOutV2(
    amountIn,
    hop.pair.reserve1,
    hop.pair.reserve0
  );
}

export function quoteMultiHop(
  amountIn: bigint,
  route: Hop[]
): bigint {
  let amount = amountIn;

  for (const hop of route) {
    amount = quoteHop(amount, hop);

    if (amount === 0n) {
      return 0n;
    }
  }

  return amount;
}
