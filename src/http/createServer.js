const express = require("express");
module.exports = function createServer() {
  const app = express();
  app.disable("x-powered-by");
  return app;
};
