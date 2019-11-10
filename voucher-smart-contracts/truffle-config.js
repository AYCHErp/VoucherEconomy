module.exports = {
  networks: {
    ganache: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
  },

  compilers: {
    solc: {
      version: "0.5.10",
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
      }
    }
  }
}
