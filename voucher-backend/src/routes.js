"use strict"

const fs = require("fs");
const ethers = require("ethers");
const config = JSON.parse(fs.readFileSync("./config/migrationsConfig.json", "utf8"));
const addresses = config;

const VoucherHandler = require("./VoucherHandler.js");
const Token = require("../artifacts/VoucherToken").abi;

// root wallet is the 2nd address along standard ethereum derivation path
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const rootWallet = ethers.Wallet.fromMnemonic(config.mnemonic, "m/44'/60'/0'/0/1").connect(provider);
const token = new ethers.Contract(addresses.tokenAddr, Token, rootWallet);
const voucherHandler = new VoucherHandler(provider, rootWallet, token);

const baseRoute = "/voucher";

let routes = [];

routes.push({
  method: "GET",
  path: baseRoute + "/balance/{address}",
  handler: async (request, h) => {
    try {
      const address = request.params.address;
      return await voucherHandler.getBalance(address);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});


routes.push({
  method: "POST",
  path: baseRoute + "/issue",
  handler: async (request, h) => {
    try {
      const amts = JSON.parse(request.payload.amounts);
      return await voucherHandler.mint(amts);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

routes.push({
  method: "POST",
  path: baseRoute + "/redeem",
  handler: async (request, h) => {
    try {
      const amts = JSON.parse(request.payload.amounts);
      return await voucherHandler.burn(amts);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

module.exports = routes;
