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
  method: "GET",
  path: baseRoute + "/nonce/{address}",
  handler: async (request, h) => {
    try {
      const address = request.params.address;
      return await voucherHandler.getBurnNonce(address);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

routes.push({
  method: "GET",
  path: baseRoute + "/burnHashFromAddress/{address}/{amount}",
  handler: async (request, h) => {
    try {
      const address = request.params.address;
      const amount = request.params.amount;
      return await voucherHandler.getBurnHashFromAddress(address, amount);
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
      const issuance = JSON.parse(request.payload.issuance);
      return await voucherHandler.mint(issuance);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

routes.push({
  method: "POST",
  path: baseRoute + "/batchIssue",
  handler: async (request, h) => {
    try {
      const amts = JSON.parse(request.payload.issuances);
      return await voucherHandler.batchMint(issuances);
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
      const tx = JSON.parse(request.payload.tx);
      return await voucherHandler.forwardTx(tx);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

// TODO:
// - meta and non-meta burn routes
// - update wallet implementation

routes.push({
  method: "POST",
  path: baseRoute + "/metaRedeem",
  handler: async (request, h) => {
    try {
      const msg = JSON.parse(request.payload.message);
      return await voucherHandler.metaBurn(msg);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

module.exports = routes;
