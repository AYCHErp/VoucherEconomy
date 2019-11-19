module.exports = {
  networks: {
    docker: {
     host: "localhost",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: 1337,       // Any network (default: none)
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
