import { ethers } from "ethers";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
} from "@flashbots/ethers-provider-bundle";

const provider = new ethers.JsonRpcProvider(
  process.env.MAINNET_RPC_URL || ""
);

const authSigner = ethers.Wallet.createRandom();

export async function createFlashbotsProvider() {
  return FlashbotsBundleProvider.create(
    provider,
    authSigner,
    "https://relay.flashbots.net",
    "mainnet"
  );
}

export async function sendBundleWithRetries(
  txs: { signedTransaction: string }[],
  blocks = 3
) {
  const flashbots = await createFlashbotsProvider();

  const currentBlock = await provider.getBlockNumber();

  for (let i = 1; i <= blocks; i++) {
    const targetBlock = currentBlock + i;

    const simulation = await flashbots.simulate(
      txs,
      targetBlock
    );

    if ("error" in simulation) {
      continue;
    }

    const response = await flashbots.sendRawBundle(
      txs.map((x) => x.signedTransaction),
      targetBlock
    );

    const resolution = await response.wait();

    if (
      resolution ===
      FlashbotsBundleResolution.BundleIncluded
    ) {
      return true;
    }
  }

  return false;
}
