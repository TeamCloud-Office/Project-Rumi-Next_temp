const path = require("node:path");
const schema = require("../schemas/stockSchema");
module.exports = class StockRepository {
  constructor({ registry, paths }) { this.database = registry.get(path.join(paths.games, "StockData.db"), "main", { autoCreate: true, schema }); }
  async find(name) { return (await this.database.get(String(name)))[0] || null; }
  async list() { return this.database.get(); }
  async save(row) { await this.database.set({ name: String(row.name), price: Number(row.price), diff: Number(row.diff || 0), updatedAt: Number(row.updatedAt || Date.now()) }); }
};
