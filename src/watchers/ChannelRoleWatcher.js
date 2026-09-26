const ChannelService = require("../services/channel/ChannelService");
const ChannelRoleService = require("../services/channel/ChannelRoleService");
module.exports = class ChannelRoleWatcher {
  constructor({ channelRepository, irisGateway, intervalMs = 60000 }) { Object.assign(this, { channelRepository, irisGateway, intervalMs }); this.running = false; this.timer = null; }
  async tick() {
    if (this.running) return; this.running = true;
    try {
      const channels = await this.channelRepository.list(); const ids = channels.map(row => String(row.id)).filter(Boolean);
      if (!ids.length) return;
      const roles = await this.irisGateway.getChannelsRoles(ids);
      if (!(roles instanceof Map) || roles.size === 0) return;
      for (const channel of channels) {
        if (!roles.has(String(channel.id))) continue;
        const service = new ChannelService({ repository: this.channelRepository, channelId: channel.id });
        const role = roles.get(String(channel.id)); await new ChannelRoleService(service).sync(role.hostId, role.subHostIds);
      }
    } catch (error) { console.error("Channel role watcher failed:", error.message); }
    finally { this.running = false; }
  }
  start() { if (this.timer) return this.timer; this.timer = setInterval(() => this.tick(), this.intervalMs); this.timer.unref?.(); return this.timer; }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
};
