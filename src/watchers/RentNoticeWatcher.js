const ChannelService = require("../services/channel/ChannelService");
const RentalService = require("../services/channel/RentalService");
module.exports = class RentNoticeWatcher {
  constructor({ channelRepository, replyClient, intervalMs = 60000, noticeDays = 3 }) { Object.assign(this, { channelRepository, replyClient, intervalMs, noticeDays }); this.sent = new Set(); this.running = false; this.timer = null; }
  async tick() {
    if (this.running) return; this.running = true;
    try {
      for (const row of await this.channelRepository.list()) {
        const rental = new RentalService(new ChannelService({ repository: this.channelRepository, channelId: row.id }));
        const message = await rental.notice(this.noticeDays); if (!message) continue;
        const key = `${row.id}:${row.rent}:${this.noticeDays}`; if (this.sent.has(key)) continue;
        await this.replyClient.send(String(row.id), message); this.sent.add(key);
      }
      if (this.sent.size > 1000) this.sent = new Set([...this.sent].slice(-500));
    } catch (error) { console.error("Rent notice watcher failed:", error.message); }
    finally { this.running = false; }
  }
  start() { if (this.timer) return this.timer; this.timer = setInterval(() => this.tick(), this.intervalMs); this.timer.unref?.(); return this.timer; }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
};
