const readEnv = require("./env");
module.exports = class Config {
  constructor(env = process.env) { Object.assign(this, readEnv(env)); }
};
