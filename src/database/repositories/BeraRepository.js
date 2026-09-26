const path = require("node:path");
const schema = require("../schemas/beraSchema");
module.exports = class BeraRepository {
  constructor({ registry, paths }) { this.database = registry.get(path.join(paths.users, "games", "BeraData.db"), "ranking", { autoCreate: true, schema }); }
  async find(userId) { return (await this.database.get(String(userId)))[0] || null; }
  async list() { return this.database.get(); }
  async save(row) { await this.database.set({ userId: String(row.userId), win: Number(row.win || 0), lose: Number(row.lose || 0) }); }
};
