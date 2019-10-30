const fs = require("fs");
const BN = require("bn.js");
const ethers = require("ethers");

const VoucherToken = artifacts.require("VoucherToken");

const configPath = "migrationsConfig.json";
let config;
if(fs.existsSync("../" + configPath)) {
  config = JSON.parse(fs.readFileSync("../" + configPath, "utf8"));
} else {
  config = {};
}

// seed data
const TOKEN_DECIMALS = new BN(18);
const TOKEN_NAME = "voucher";
const TOKEN_SYMBOL = "VCH";

module.exports = async function(deployer, network, accounts) {
  const root = accounts[1];

  await deployer.deploy(VoucherToken, TOKEN_NAME, TOKEN_SYMBOL, {from:root});
  const voucherToken = await VoucherToken.deployed();

  const addresses = {
    "tokenAddr": voucherToken.address
  }

  config["tokenAddr"] = voucherToken.address;
  config["mnemonic"] = "gentle leisure predict alpha margin wisdom lucky kitten define define damage badge";
  fs.writeFileSync("./" + configPath, JSON.stringify(config), "utf8")
}
