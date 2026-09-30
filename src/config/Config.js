const readEnv = require("./env");
const defaults = require("./defaults");
const paths = require("./paths");
module.exports = class Config {
  constructor(env = process.env) {
    Object.assign(this, readEnv(env), { paths, bankHours: [...defaults.bankHours], more: defaults.more });
  }
};
