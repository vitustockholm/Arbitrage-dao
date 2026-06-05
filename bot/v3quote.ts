export function estimateV3Output(
  amountIn: bigint,
  price: bigint,
  liquidity: bigint
): bigint {
  if (liquidity === 0n) {
    return 0n;
  }

  return (amountIn * price) / liquidity;
}
