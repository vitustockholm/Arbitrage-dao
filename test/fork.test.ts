import { expect } from "chai";
import { ethers } from "hardhat";

describe("FlashLoanArbExecutor", function () {
  it("deploys correctly", async function () {
    const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

    const Executor = await ethers.getContractFactory(
      "FlashLoanArbExecutor"
    );

    const executor = await Executor.deploy(AAVE_POOL);

    expect(await executor.owner()).to.not.equal(
      ethers.ZeroAddress
    );
  });
});
