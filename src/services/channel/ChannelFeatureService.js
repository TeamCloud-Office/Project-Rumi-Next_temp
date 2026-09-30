const { defaults, labels, resolveFeatureKey } = require("../../config/featureCatalog");

function parse(value) {
  try { return { ...defaults, ...(JSON.parse(value || "{}") || {}) }; }
  catch { return { ...defaults }; }
}

module.exports = class ChannelFeatureService {
  constructor(channelService) { this.channelService = channelService; }
  async list() { return parse((await this.channelService.get())?.function); }
  async enabled(feature) {
    const key = resolveFeatureKey(feature);
    return key ? Boolean((await this.list())[key]) : false;
  }
  async set(feature, enabled) {
    const key = resolveFeatureKey(feature);
    if (!key) return "존재하지 않는 기능이에요.";
    const features = await this.list();
    if (features[key] === Boolean(enabled)) return `기능이 이미 ${enabled ? "활성화" : "비활성화"}되어 있어요.`;
    features[key] = Boolean(enabled);
    await this.channelService.update({ function: JSON.stringify(features) });
    return `${labels[key] || key} 기능이 ${enabled ? "활성화" : "비활성화"}되었어요.`;
  }
};
