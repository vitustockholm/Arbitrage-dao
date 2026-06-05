import { PairState } from "./types";

function getAmountOut(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): bigint {
  const amountInWithFee = amountIn * 997n;

  return (
    (amountInWithFee * reserveOut) /
    (reserveIn * 1000n + amountInWithFee)
  );
}

function simulateTwoHop(
  amountIn: bigint,
  pair1: PairState,
  pair2: PairState,
  tokenBorrow: string
): bigint {
  let reserveIn1: bigint;
  let reserveOut1: bigint;

  if (pair1.token0.toLowerCase() === tokenBorrow.toLowerCase()) {
    reserveIn1 = pair1.reserve0;
    reserveOut1 = pair1.reserve1;
  } else {
    reserveIn1 = pair1.reserve1;
    reserveOut1 = pair1.reserve0;
  }

  const midAmount = getAmountOut(
    amountIn,
    reserveIn1,
    reserveOut1
  );

  let reserveIn2: bigint;
  let reserveOut2: bigint;

  if (pair2.token1.toLowerCase() === tokenBorrow.toLowerCase()) {
    reserveIn2 = pair2.reserve0;
    reserveOut2 = pair2.reserve1;
  } else {
    reserveIn2 = pair2.reserve1;
    reserveOut2 = pair2.reserve0;
  }

  return getAmountOut(midAmount, reserveIn2, reserveOut2);
}

export type OptimizationResult = {
  optimalInput: bigint;
  expectedOutput: bigint;
  expectedProfit: bigint;
};

export function optimizeArbitrage(
  pair1: PairState,
  pair2: PairState,
  tokenBorrow: string,
  minInput: bigint,
  maxInput: bigint,
  steps = 30
): OptimizationResult | null {
  let bestProfit = 0n;
  let bestInput = 0n;
  let bestOutput = 0n;

  const stepSize = (maxInput - minInput) / BigInt(steps);

  for (let i = 0; i <= steps; i++) {
    const amountIn = minInput + stepSize * BigInt(i);

    const finalAmount = simulateTwoHop(
      amountIn,
      pair1,
      pair2,
      tokenBorrow
    );

    const profit = finalAmount - amountIn;

    if (profit > bestProfit) {
      bestProfit = profit;
      bestInput = amountIn;
      bestOutput = finalAmount;
    }
  }

  if (bestProfit <= 0n) {
    return null;
  }

  return {
    optimalInput: bestInput,
    expectedOutput: bestOutput,
    expectedProfit: bestProfit,
  };
}
