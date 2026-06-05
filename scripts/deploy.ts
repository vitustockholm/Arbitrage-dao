import { ethers } from "hardhat";

async function main() {
  const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  const Executor = await ethers.getContractFactory(
    "FlashLoanArbExecutor"
  );

  const executor = await Executor.deploy(AAVE_POOL);

  await executor.waitForDeployment();

  console.log(
    "Executor deployed:",
    await executor.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
