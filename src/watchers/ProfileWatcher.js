module.exports = class ProfileWatcher {
  constructor({ irisGateway, events, channelRepository, intervalMs = 60000 }) { Object.assign(this, { irisGateway, events, channelRepository, intervalMs }); this.snapshots = new Map(); this.running = false; this.timer = null; }
  async tick() {
    if (this.running) return; this.running = true;
    try {
      const rows = await this.irisGateway.getMemberProfiles(); const current = new Set();
      for (const row of rows) {
        if (row.involved_chat_id == null || row.user_id == null) continue;
        const channelId = String(row.involved_chat_id), userId = String(row.user_id), key = `${channelId}:${userId}`; current.add(key);
        const next = { nickname: row.nickname || null, profile: row.original_profile_image_url || null }; const previous = this.snapshots.get(key); this.snapshots.set(key, next);
        if (!previous || (previous.nickname === next.nickname && previous.profile === next.profile)) continue;
        const channel = await this.channelRepository.find(channelId);
        await this.events.emit("changeProfile", { type: "changeProfile", channel: { id: channelId, name: channel?.name || null }, user: { id: userId, name: next.nickname, profile: next.profile }, previous, now: next, raw: row });
      }
      for (const key of this.snapshots.keys()) if (!current.has(key)) this.snapshots.delete(key);
    } catch (error) { console.error("Profile watcher failed:", error.message); }
    finally { this.running = false; }
  }
  start() { if (this.timer) return this.timer; this.timer = setInterval(() => this.tick(), this.intervalMs); this.timer.unref?.(); return this.timer; }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; this.snapshots.clear(); }
};
