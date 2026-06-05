import { ethers } from "ethers";

const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] path,address to,uint deadline)",
  "function swapExactETHForTokens(uint amountOutMin,address[] path,address to,uint deadline)",
  "function swapExactTokensForETH(uint amountIn,uint amountOutMin,address[] path,address to,uint deadline)"
];

const iface = new ethers.Interface(ROUTER_ABI);

export type DecodedSwap = {
  name: string;
  amountIn: bigint;
  path: string[];
};

export function decodeRouterSwap(txData: string, txValue: bigint): DecodedSwap | null {
  try {
    const parsed = iface.parseTransaction({
      data: txData,
      value: txValue,
    });

    if (!parsed) return null;

    if (parsed.name === "swapExactETHForTokens") {
      return {
        name: parsed.name,
        amountIn: txValue,
        path: parsed.args.path,
      };
    }

    return {
      name: parsed.name,
      amountIn: parsed.args.amountIn,
      path: parsed.args.path,
    };
  } catch {
    return null;
  }
}
