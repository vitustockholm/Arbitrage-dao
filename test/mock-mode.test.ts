import { expect } from "chai";
import { ethers } from "hardhat";

describe("Mock Mode", function () {
  it("runs without mainnet fork", async function () {
    const [signer] = await ethers.getSigners();

    const balance = await ethers.provider.getBalance(
      signer.address
    );

    expect(balance).to.be.gt(0n);
  });
});
