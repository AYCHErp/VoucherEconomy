const { BN, constants, expectRevert } = require("openzeppelin-test-helpers");
const { expect } = require("chai");

const VoucherToken = artifacts.require("VoucherToken");

contract("VoucherToken", function([any, root, user]) {

  beforeEach("deploy contracts", async () => {
    this.name = "name";
    this.symbol = "FOO";
    this.tag = web3.utils.keccak256("foo");

    this.token = await VoucherToken.new(name, symbol, {from: root});
  });

  describe("when deploying the token contract", () => {
    it("should deploy successfully", async () => {
      expect(this.token.address).to.not.eq(constants.ZERO_ADDRESS);
    });

    it("should properly set constructor arguments", async () => {
      expect(await this.token.name()).to.eq(this.name);
      expect(await this.token.symbol()).to.eq(this.symbol);
    });
  });

  describe("when calling mint", () => {
    mintAmt = new BN(100000);

    it("should fail unless called by owner", async () => {
      await expectRevert(
        this.token.mint(any, mintAmt, this.tag, {from: any}),
        "Ownable: caller is not the owner"
      );
    });

    it("should update dst balance", async () => {
      await this.token.mint(user, mintAmt, this.tag, {from: root});
      expect(await this.token.balances(user)).to.be.bignumber.eq(mintAmt);
    });
  });

  describe("when calling burn", async () => {
    mintAmt = new BN(100000);
    burnAmt = new BN(50000);

    beforeEach("mint tokens", async () => {
      await this.token.mint(user, mintAmt, this.tag, {from: root});
    });

    it("should fail if src has insufficient tokens", async () => {
      await expectRevert(
        this.token.burn(mintAmt + 1, {from:user}),
        "SafeMath: subtraction overflow"
      );
    });

    it("should update src balance", async () => {
      await this.token.burn(burnAmt, {from:user});
      expect(await this.token.balances(user)).to.be.bignumber.eq(mintAmt.sub(burnAmt));
    });
  });

});
