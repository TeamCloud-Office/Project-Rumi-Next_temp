const defaults = require("./defaults");
function integer(value, fallback, name, minimum = 1) {
  const number = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isInteger(number) || number < minimum || number > (name === "PORT" ? 65535 : 2147483647)) {
    throw new Error(`Invalid ${name}`);
  }
  return number;
}
module.exports = function readEnv(env = process.env) {
  const url = new URL(env.IRIS_BASE_URL || defaults.irisBaseUrl);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid IRIS_BASE_URL");
  return {
    host: env.HOST || defaults.host,
    port: integer(env.PORT, defaults.port, "PORT", 0),
    irisBaseUrl: url.href.replace(/\/$/, ""),
    irisTimeoutMs: integer(env.IRIS_TIMEOUT_MS, defaults.irisTimeoutMs, "IRIS_TIMEOUT_MS"),
    commandPrefixes: [...defaults.commandPrefixes],
    devChannelId: String(env.DEV_CHANNEL_ID || defaults.devChannelId),
    enableEval: String(env.ENABLE_EVAL || "false").toLowerCase() === "true",
    watcherIntervalMs: integer(env.WATCHER_INTERVAL_MS, defaults.watcherIntervalMs, "WATCHER_INTERVAL_MS"),
  };
};
