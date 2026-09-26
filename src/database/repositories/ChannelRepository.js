const path = require("node:path");
const schema = require("../schemas/channelSchema");

module.exports = class ChannelRepository {
  constructor({ registry, paths }) {
    this.database = registry.get(path.join(paths.channels, "ChannelJLLog.db"), "channels", { autoCreate: true, schema });
  }
  async find(channelId) { return (await this.database.get("id", String(channelId)))[0] || null; }
  async list() { return this.database.get(); }
  async save(channel) { await this.database.set(channel); return channel; }
  async remove(channelId) { return this.database.delete(String(channelId)); }
};
