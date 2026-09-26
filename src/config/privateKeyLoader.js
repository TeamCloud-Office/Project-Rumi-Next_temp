const fs = require("node:fs");
const path = require("node:path");
module.exports = function loadPrivateKeys(root) {
  const projectRoot = root ? path.resolve(root) : path.resolve(__dirname, "../..");
  const file = process.env.RUMI_CONFIG_PATH
    ? path.join(path.resolve(process.env.RUMI_CONFIG_PATH), "private.json")
    : path.join(projectRoot, "config", "private.json");
  try {
    const content = fs.readFileSync(file, "utf8").trim();
    return content ? JSON.parse(content) : {};
  } catch (error) { if (error.code === "ENOENT") return {}; throw error; }
};
