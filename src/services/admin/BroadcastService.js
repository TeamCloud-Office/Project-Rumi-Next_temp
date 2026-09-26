const ChannelService = require("../channel/ChannelService");
const RentalService = require("../channel/RentalService");
module.exports = class BroadcastService {
  constructor({ channelRepository, replyClient }) { Object.assign(this, { channelRepository, replyClient }); }
  async send(message) {
    const content = String(message ?? "").trim();
    if (!content) return { total: 0, success: [], failed: [], error: "전송할 메시지를 입력해주세요." };
    const active = [];
    for (const channel of await this.channelRepository.list()) {
      const service = new ChannelService({ repository: this.channelRepository, channelId: channel.id });
      if (await new RentalService(service).check()) active.push(channel);
    }
    const success = [], failed = [];
    for (const channel of active) {
      try { await this.replyClient.send(String(channel.id), content); success.push(channel); }
      catch (error) { failed.push({ ...channel, error: error.message }); }
    }
    return { total: active.length, success, failed, error: null };
  }
};
