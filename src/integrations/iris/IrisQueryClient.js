module.exports = class IrisQueryClient {
  constructor(client) { this.client = client; }
  async query(query, bind = []) {
    const result = await this.client.post("/query", { query, bind });
    if (!Array.isArray(result?.data)) throw new Error("Invalid Iris query response");
    return result.data;
  }
};
