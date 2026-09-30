const path = require("node:path");
const schema = require("../schemas/userSchema");

module.exports = class UserRepository {
  constructor({ registry, paths }) {
    this.registry = registry;
    this.file = path.join(paths.users, "UserData.db");
  }
  database(channelId) { return this.registry.get(this.file, String(channelId), { autoCreate: true, schema }); }
  async findByPrivateId(channelId, userId) { return (await this.database(channelId).get("privateId", String(userId)))[0] || null; }
  async findByPublicId(channelId, publicId) { return (await this.database(channelId).get("publicId", String(publicId).toUpperCase()))[0] || null; }
  async findByName(channelId, name) { return this.database(channelId).get("name", String(name)); }
  async list(channelId) { return this.database(channelId).get(); }
  async channelIds() { return this.registry.get(this.file, null).tables(); }
  async hasChannel(channelId) { return (await this.channelIds()).includes(String(channelId)); }
  async save(channelId, user) { await this.database(channelId).set(user); return user; }
  async remove(channelId, userId) { return this.database(channelId).delete(String(userId)); }
};
