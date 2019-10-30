const { BN, constants, expectRevert } = require("openzeppelin-test-helpers");
const { expect } = require("chai");

const VoucherToken = artifacts.require("VoucherToken");

contract("VoucherToken", function([any, root]) {
  const name = "name";
  const symbol = "FOO";

  beforeEach("deploy contracts", async () => {
    this.token = await VoucherToken.new(name, symbol, {from: root});
  });

  describe("when deploying the token contract", () => {
    it("should deploy successfully", async () => {
      expect(this.token.address).to.not.eq(constants.ZERO_ADDRESS);
    });

    it("should properly set constructor arguments", async () => {
      expect(await this.token.name()).to.eq(name);
      expect(await this.token.symbol()).to.eq(symbol);
    });
  });

  describe("when calling mint", () => {
    mintAmt = new BN(100000);

    it("should fail unless called by owner", async () => {
      await expectRevert(
        this.token.mint(any, mintAmt, {from: any}),
        "Ownable: caller is not the owner"
      );
    });

    it("should update dst balance", async () => {
      await this.token.mint(any, mintAmt, {from: root});
      expect(await this.token.balances(any)).to.be.bignumber.eq(mintAmt);
    });
  });

  describe("when calling burn", async () => {
    mintAmt = new BN(100000);
    burnAmt = new BN(50000);

    beforeEach("mint tokens", async () => {
      await this.token.mint(any, mintAmt, {from: root});
    });

    it("should fail unless called by owner", async () => {
      await expectRevert(
        this.token.burn(any, mintAmt, {from:any}),
        "Ownable: caller is not the owner"
      );
    });

    it("should fail if src has insufficient tokens", async () => {
      await expectRevert(
        this.token.burn(any, mintAmt + 1, {from:root}),
        "SafeMath: subtraction overflow"
      );
    });

    it("should update src balance", async () => {
      await this.token.burn(any, burnAmt, {from:root});
      expect(await this.token.balances(any)).to.be.bignumber.eq(mintAmt.sub(burnAmt));
    });
  });
});
