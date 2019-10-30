"use strict"

const { Server } = require("@hapi/hapi");
const routes = require("./src/routes");

const server = new Server({
  host: "localhost",
  port: 8081
});

const setRoutes = () => {
  routes.forEach(route => {
    server.route(route);
  });
};

(async () => {
  try {
    setRoutes();
    await server.start();
    console.log("Voucher Server running at:", server.info.uri);
  } catch(err) {
    console.log(err);
    process.exit(err.code || 1);
  }
})();
