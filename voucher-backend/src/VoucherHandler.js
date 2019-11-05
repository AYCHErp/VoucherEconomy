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

  // takes amts = [{ user, amt }]
  // TODO: improve sequencing here
  async mint(amts = []) {
    for (const user of amts) {
      await this._token.mint(user.address, user.amt)
    }
    return true;
  }

  async getBurnNonce(address) {
    return (await this._token.burnNonces(address)).toString();
  }

  // takes amts = [{ user, amt }]
  async burn(amts = []) {
    for (const user of amts) {
      const addr = this._didToAddr(user.did);
      await this._token.burn(addr, user.amt)
    }
    return true;
  }

  _didToAddr(did) {
    const hexDid = "0x" + Buffer.from(did).toString("hex");
    return ethers.utils.keccak256(hexDid).slice(0, 42);
  }
}

module.exports = exports = VoucherHandler;
