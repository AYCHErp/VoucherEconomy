"use strict"

const fs = require("fs");
const Joi = require("@hapi/joi");
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

const validationFailAction = (request, h, err) => {
  console.log("Validation Error:", err.message)
  throw err
}

routes.push({
  method: "GET",
  path: baseRoute + "/balance/{address}",
  config: {
    validate: {
      failAction: validationFailAction,
      params: Joi.object({
        address: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required()
      })
    },
  },
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
  config: {
    validate: {
      failAction: validationFailAction,
      params: Joi.object({
        address: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required()
      })
    },
  },
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
  config: {
    validate: {
      failAction: validationFailAction,
      params: Joi.object({
        address: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required(),
        amount: Joi.number()
          .integer()
          .min(0)
          .required()
      })
    },
  },
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
  method: "GET",
  path: baseRoute + "/burnHash/{nonce}/{amount}",
  config: {
    validate: {
      failAction: validationFailAction,
      params: Joi.object({
        nonce: Joi.number()
          .integer()
          .min(0)
          .required(),
        amount: Joi.number()
          .integer()
          .min(0)
          .required()
      })
    },
  },
  handler: async (request, h) => {
    try {
      const nonce = request.params.nonce;
      const amount = request.params.amount;
      return await voucherHandler.getBurnHash(nonce, amount);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

routes.push({
  method: "POST",
  path: baseRoute + "/issue",
  config: {
    validate: {
      failAction: validationFailAction,
      payload: Joi.object({
        address: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required(),
        amount: Joi.number()
          .integer()
          .min(0)
          .required(),
        tag: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{64}$/)
          .required(),
      })
    },
  },
  handler: async (request, h) => {
    try {
      const addr = request.payload.address;
      const amt = request.payload.amount;
      const tag = request.payload.tag;
      return await voucherHandler.mint(addr, amt, tag);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

routes.push({
  method: "POST",
  path: baseRoute + "/metaRedeem",
  config: {
    validate: {
      failAction: validationFailAction,
      payload: Joi.object({
        signature: Joi.string()
          .alphanum()
          .pattern(/^0x[a-fA-F0-9]{130}$/)
          .required(),
        nonce: Joi.number()
          .integer()
          .min(0)
          .required(),
        amount: Joi.number()
          .integer()
          .min(0)
          .required()
      })
    },
  },
  handler: async (request, h) => {
    try {
      const sig = request.payload.signature;
      const nonce = request.payload.nonce;
      const amt = request.payload.amount;
      return await voucherHandler.metaBurn(sig, nonce, amt);
    } catch (err) {
      console.log(err);
      throw(err);
    }
  }
});

module.exports = routes;
