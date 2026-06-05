import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fork Network", function () {
  it("gets current block", async function () {
    const block = await ethers.provider.getBlockNumber();

    expect(block).to.be.greaterThan(0);
  });

  it("provider responds correctly", async function () {
    const feeData = await ethers.provider.getFeeData();

    expect(feeData).to.not.equal(undefined);
  });
});
