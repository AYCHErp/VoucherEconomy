"use strict"

const ethers = require("ethers");
const Boom = require("@hapi/boom");

class VoucherHandler {

  constructor(provider, wallet, token) {
    Object.defineProperties(this, {
      _provider: {value: provider},
      _token: {value: token},
      _wallet: {value: wallet}
    });
  }

  get tokens() {
    return this._tokens;
  }

  get provider() {
    return this._provider;
  }

  async getBalance(address) {
    return (await this._token.balances(address)).toString();
  }

  // returns promise
  async mint(issuance) {
    return await this._token.mint(issuance.address, issuance.amount, issuance.tag);
  }

  // takes issuances = [{ address, amount, tag }]
  // TODO: change naming from user / amts
  async batchMint(amts = []) {
    var promises = [];
    for (const issuance of issuances) {
      promises.push(
        this._token.mint(
          issuance.address,
          issuance.amount,
          issuance.tag
        )
      );
    }

    await Promise.all(promises);

    return true;
  }

  async getBurnNonce(address) {
    return (await this._token.burnNonces(address)).toString();
  }

  async getBurnHash(nonce, amt) {
    return await this._token.getBurnHash(nonce, amt);
  }

  async getBurnHashFromAddress(address, amt) {
    const nonce = await this._token.burnNonces(address);
    return await this._token.getBurnHash(nonce, amt);
  }

  async forwardTx(tx) {
    return await _provider.sendTransaction(tx);
  }

  // takes msg = { signature, nonce, amount }
  async metaBurn(msg) {
    return await this._token.metaBurn(msg.signature, msg.nonce, msg.amount);
  }

}

module.exports = exports = VoucherHandler;
