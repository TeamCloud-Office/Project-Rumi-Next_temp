function subHosts(value) {
  let items = value;
  if (typeof value === "string") { try { items = JSON.parse(value); } catch { items = value ? [value] : []; } }
  if (!Array.isArray(items)) items = items == null ? [] : [items];
  return [...new Set(items.map(String).filter(Boolean))].sort();
}
module.exports = class ChannelRoleService {
  constructor(channelService) { this.channelService = channelService; }
  async isHost(userId) { return String((await this.channelService.get())?.host || "") === String(userId); }
  async isSubHost(userId) { return subHosts((await this.channelService.get())?.subHost).includes(String(userId)); }
  async isManager(userId) { return await this.isHost(userId) || await this.isSubHost(userId); }
  async sync(hostId, subHostIds) {
    const channel = await this.channelService.get();
    if (!channel) return false;
    const nextHost = hostId == null ? null : String(hostId);
    const nextSubs = subHosts(subHostIds);
    if (String(channel.host || "") === String(nextHost || "") && JSON.stringify(subHosts(channel.subHost)) === JSON.stringify(nextSubs)) return false;
    await this.channelService.update({ host: nextHost, subHost: JSON.stringify(nextSubs) });
    return true;
  }
};
module.exports.subHosts = subHosts;
