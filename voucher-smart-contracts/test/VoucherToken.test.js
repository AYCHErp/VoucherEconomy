const { BN, constants, expectRevert } = require("openzeppelin-test-helpers");
const ethers = require("ethers");
const { expect } = require("chai");

const VoucherToken = artifacts.require("VoucherToken");

contract("VoucherToken", function([any, root, user]) {

  beforeEach("deploy contracts", async () => {
    // token info
    this.name = "name";
    this.symbol = "FOO";
    this.tag = web3.utils.keccak256("foo");

    // create user wallet for meta transaction signatures
    this.metaUserWallet = ethers.Wallet.createRandom();
    this.metaUser = this.metaUserWallet.address;

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

    it("should revert unless called by owner", async () => {
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

    it("should revert if src has insufficient tokens", async () => {
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

  describe("when calling metaBurn -- fail", async () => {
    var nonce = 0;
    mintAmt = new BN(100000);
    burnAmt = new BN(5000);

    beforeEach("mint tokens", async () => {
      await this.token.mint(this.metaUser, mintAmt, this.tag, {from: root});
    });

    it("should revert if signature is too short", async () => {
      await expectRevert(
        this.token.metaBurn(ethers.utils.randomBytes(64), nonce, burnAmt),
        "VoucherToken: invalid sig length"
      );
    });

    it("should revert if signature is invalid", async () => {
      // Note: this will revert with subtraction underflow because exrecover
      // with random 65 bytes will return a signer address, and the signer will
      // not have sufficient balance to burn `burnAmt` of tokens
      await expectRevert(
        this.token.metaBurn(ethers.utils.randomBytes(65), nonce, burnAmt),
        "SafeMath: subtraction overflow"
      );
    });

    it("should revert if message is replayed", async () => {
      // sign burn message
      const txDataHash = await this.token.getBurnHash('0', burnAmt);
      const splitSig = (new ethers.utils.SigningKey(this.metaUserWallet.privateKey)).signDigest(txDataHash);
      const sig = ethers.utils.joinSignature(splitSig);

      // send burn message with 0 nonce
      await this.token.metaBurn(sig, '0', burnAmt);

      // replay burn message
      await expectRevert(
        this.token.metaBurn(sig, '0', burnAmt),
        "VoucherToken: invalid nonce"
      );
    });

    it("should revert if nonce < current nonce", async () => {
      // sign burn message
      const txDataHash = await this.token.getBurnHash('0', burnAmt);
      const splitSig = (new ethers.utils.SigningKey(this.metaUserWallet.privateKey)).signDigest(txDataHash);
      const sig = ethers.utils.joinSignature(splitSig);

      // send burn message with 0 nonce
      this.token.metaBurn(sig, '0', burnAmt);

      // sign burn message with invalid nonce
      const badTxDataHash = await this.token.getBurnHash('0', burnAmt);
      const badSplitSig = (new ethers.utils.SigningKey(this.metaUserWallet.privateKey)).signDigest(txDataHash);
      const badSig = ethers.utils.joinSignature(splitSig);

      // send burn message with nonce < current nonce
      await expectRevert(
        this.token.metaBurn(badSig, '0', burnAmt),
        "VoucherToken: invalid nonce"
      );
    });
  });

  describe("when calling metaBurn -- pass", async () => {
    mintAmt = new BN(100000);
    burnAmt = new BN(50000);

    beforeEach("mint tokens", async () => {
      nonce = new BN(0);

      // mint tokens to user
      await this.token.mint(this.metaUser, mintAmt, this.tag, {from: root});

      // sign burn message
      const txDataHash = await this.token.getBurnHash(nonce, burnAmt);
      const splitSig = (new ethers.utils.SigningKey(this.metaUserWallet.privateKey)).signDigest(txDataHash);
      const sig = ethers.utils.joinSignature(splitSig);

      // send burn message with 0 nonce
      this.token.metaBurn(sig, nonce, burnAmt);

      // increment nonce
      nonce = nonce.add(new BN(1));
    });

    it("should update src balance", async () => {
      const newBalance = await this.token.balances(this.metaUser);
      expect(newBalance).to.be.bignumber.eq(mintAmt.sub(burnAmt));
    });

    it("should update src nonce", async () => {
      const newNonce = await this.token.burnNonces(this.metaUser);
      expect(newNonce).to.be.bignumber.eq(nonce);
    });

  });
});
