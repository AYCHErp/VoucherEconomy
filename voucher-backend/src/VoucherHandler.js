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

  async getBalance(did) {
    const addr = this._didToAddr(did);
    return (await this._token.balances(addr)).toString();
  }

  // takes amts = [{ user, amt }]
  async mint(amts = []) {
    for (const user of amts) {
      const addr = this._didToAddr(user.did);
      await this._token.mint(addr, user.amt)
    }
    return true;
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
