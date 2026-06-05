import { expect } from "chai";
import { quoteMultiHop } from "../bot/multihop";

describe("Multi Hop", function () {
  it("quotes route output", async function () {
    const output = quoteMultiHop(1000n, []);

    expect(output).to.equal(1000n);
  });
});
