const { defaults: defaultFeatures } = require("../../config/featureCatalog");

module.exports = class ChannelService {
  constructor({ repository, channelId }) { this.repository = repository; this.channelId = String(channelId); }
  async get() { return this.repository.find(this.channelId); }
  async ensure(name = "") {
    const current = await this.get();
    if (!current) {
      return this.repository.save({ id: this.channelId, name: String(name || ""), state: 0, rent: JSON.stringify({ startDate: "", endDate: "", totalDays: 0 }), function: JSON.stringify(defaultFeatures), host: null, subHost: "[]", adminMemo: null });
    }
    let features = {};
    try { features = JSON.parse(current.function || "{}"); } catch {}
    const next = { ...defaultFeatures, ...features };
    if (JSON.stringify(next) !== current.function || (name && current.name !== name)) return this.repository.save({ ...current, name: name || current.name, function: JSON.stringify(next) });
    return current;
  }
  async isRented() { return Boolean(Number((await this.get())?.state || 0)); }
  async update(patch) {
    const current = await this.get();
    if (!current) return null;
    return this.repository.save({ ...current, ...patch, id: this.channelId });
  }
  async featureEnabled(key) {
    const channel = await this.get();
    try { return Boolean(JSON.parse(channel?.function || "{}")[key]); } catch { return false; }
  }
};
