const path = require("node:path");
const schema = require("../schemas/userLogSchema");
module.exports = class UserLogRepository {
  constructor({ registry, paths }) { this.registry = registry; this.file = path.join(paths.users, "UserJLLog.db"); }
  database(channelId) { return this.registry.get(this.file, String(channelId), { autoCreate: true, schema }); }
  async find(channelId, userId) { return (await this.database(channelId).get("userId", String(userId)))[0] || null; }
  async list(channelId) { return this.database(channelId).get(); }
  async channelIds() { return this.registry.get(this.file, null).tables(); }
  async hasChannel(channelId) { return (await this.channelIds()).includes(String(channelId)); }
  async save(channelId, row) { await this.database(channelId).set(row); return row; }
};
