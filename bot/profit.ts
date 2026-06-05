import { CONFIG } from "./config";

export function calculateAavePremium(amount: bigint): bigint {
  return (
    (amount * CONFIG.risk.flashloanPremiumBps) /
    10000n
  );
}

export function calculateGasCost(
  gasLimit: bigint,
  gasPrice: bigint
): bigint {
  return gasLimit * gasPrice;
}

export function calculateNetProfit(
  grossProfit: bigint,
  flashloanAmount: bigint,
  gasLimit: bigint,
  gasPrice: bigint
) {
  const premium = calculateAavePremium(flashloanAmount);

  const gasCost = calculateGasCost(
    gasLimit,
    gasPrice
  );

  return grossProfit - premium - gasCost;
}
