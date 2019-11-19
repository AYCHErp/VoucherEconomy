# Voucher Economy
The voucher economy is the 121 mechanism for issuing "vouchers" and allowing them to be redeemed for cash transfers.

### Usage
`cd voucher-backend && npm install`  
`npm run start`  

This will pull and start the smart contracts docker image, which contains a seeded ganache-cli Ethereum blockchain instance with the VoucherToken smart contract deployed.
The server will be started on `localhost:8081`

### Parameters

An `address` is a 40 character, `0x`-prefixed hexadecimal string. Ex: `0x62c7187D06085Df7F0306acCB5ACf22f5ad8ed4e`.

A `nonce` is an unsigned integer.

An `amount` is an unsigned integer.

A `signature` is a 128 character, `0x`-prefixed hexadecimal string. Ex: `0x4c00f5908038b372bed1addfd80d51f37261f55afaa4424b8a2744c5e4fd83544259369f55471d0d5936561feaed0f30f2f668ae70a2ffbe5c7194a5f5face711b`.

A `tag` is a 64 character, `0x`-prefixed hexadecimal string. Ex: `0x41b1a0649752af1b28b3dc29a1556eee781e4a4c3a1f7f53f90fa834de098c4d`.

### Endpoints

- GET `/voucher/balance/{address}`
    - `address` - Ethereum address of the user of interest

- GET `/voucher/nonce/{address}`
    - `address` - Ethereum address of the user of interest

- GET `/voucher/burnHash/{nonce}/{amount}`
    - `nonce` - The current nonce for the user who will sign the burn hash
    - `amount` - The quantity of funds the user wishes to redeem

- POST `voucher/issue`
    - Params:
        - `address`: Ethereum address to issue vouchers to
        - `amount`: Quantity of vouchers to issue
        - `tag`: The tracking tag to associate with the funds

- POST `voucher/metaRedeem`
    - Params:
        - `signature`: The burnHash with the parameters below, signed by the private key of the user
        - `nonce` - The current nonce for the user who will sign the burn hash
        - `amount` - The quantity of funds the user wishes to redeem

