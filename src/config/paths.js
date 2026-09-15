const path = require("node:path");
const root = path.resolve(__dirname, "../..");
module.exports = { root, envFile: path.join(root, ".env"), data: path.join(root, "data") };
