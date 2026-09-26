const path = require("node:path");
const schema = require("../schemas/attendanceSchema");

module.exports = class AttendanceRepository {
  constructor({ registry, paths }) {
    this.registry = registry;
    this.file = path.join(paths.users, "games", "AttendanceData.db");
    this.listDatabase = registry.get(this.file, "list", { autoCreate: true, schema: schema.daily });
  }
  statsDatabase(channelId) { return this.registry.get(this.file, String(channelId), { autoCreate: true, schema: schema.stats }); }
  async getTodayList(channelId, today) {
    const row = (await this.listDatabase.get(String(channelId)))[0];
    if (!row || row.today !== today) return [];
    try { const ids = JSON.parse(row.userId || "[]"); return Array.isArray(ids) ? ids.map(String) : []; } catch { return []; }
  }
  async saveTodayList(channelId, today, ids) {
    await this.listDatabase.set({ channelId: String(channelId), today, userId: JSON.stringify(ids.map(String)) });
  }
  async getStats(channelId, userId) { return (await this.statsDatabase(channelId).get(String(userId)))[0] || null; }
  async saveStats(channelId, userId, stats) { await this.statsDatabase(channelId).set({ ...stats, id: String(userId) }); }
};
