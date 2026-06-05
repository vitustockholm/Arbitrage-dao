import { ethers } from "ethers";

const provider = new ethers.WebSocketProvider(
  process.env.MAINNET_WS_URL || ""
);

const ROUTER_SELECTORS = new Set([
  "0x38ed1739",
  "0x7ff36ab5",
  "0x18cbafe5",
]);

export async function startMempoolWatcher() {
  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);

      if (!tx || !tx.data) {
        return;
      }

      const selector = tx.data.slice(0, 10);

      if (!ROUTER_SELECTORS.has(selector)) {
        return;
      }

      console.log("Candidate tx:", tx.hash);
    } catch {
      return;
    }
  });
}

startMempoolWatcher().catch(console.error);
