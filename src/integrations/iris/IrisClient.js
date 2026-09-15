const JSONBigInt = require("json-bigint")({ storeAsString: true, strict: true });
module.exports = class IrisClient {
  constructor({ irisBaseUrl, irisTimeoutMs }) { this.baseUrl = irisBaseUrl; this.timeoutMs = irisTimeoutMs; }
  async post(endpoint, body) {
    const signal = AbortSignal.timeout(this.timeoutMs);
    const origin = new URL(this.baseUrl).origin;
    let response;
    let text;
    try {
      response = await fetch(this.baseUrl + endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), signal,
      });
      text = await response.text();
    } catch (cause) {
      const timeout = signal.aborted || cause.name === "TimeoutError";
      const error = new Error(timeout
        ? `Iris ${endpoint} timed out after ${this.timeoutMs}ms (${origin})`
        : `Iris ${endpoint} connection failed (${origin}; ${cause.cause?.code || cause.code || cause.name})`, { cause });
      error.code = timeout ? "IRIS_TIMEOUT" : "IRIS_CONNECTION_FAILED";
      throw error;
    }
    if (!response.ok) throw new Error(`Iris ${endpoint} failed: HTTP ${response.status} (${origin})`);
    const result = text ? JSONBigInt.parse(text) : null;
    if (result?.ok === false || result?.success === false || result?.error) throw new Error(`Iris ${endpoint} rejected request`);
    return result;
  }
};
