const { pick, integer } = require("../../utils/random");

class ConversationService {
  constructor({ messageRepository, userService, now = () => new Date() }) {
    Object.assign(this, { messageRepository, userService, now });
    this.callCounts = ConversationService.callCounts;
  }
  async render(text) {
    const user = await this.userService.info(); if (!user) return "";
    const now = this.now();
    const tokens = { "${nickname}": user.name, "${Like}": String(user.favorability), "${YYYY}": String(now.getFullYear()), "${MM}": String(now.getMonth() + 1), "${DD}": String(now.getDate()), "${W}": ["일", "월", "화", "수", "목", "금", "토"][now.getDay()], "${hh}": String(now.getHours()), "${mm}": String(now.getMinutes()), "${ss}": String(now.getSeconds()) };
    return Object.entries(tokens).reduce((value, [key, replacement]) => value.split(key).join(replacement), String(text || ""));
  }
  async matchesCondition(row, name) {
    const condition = String(row.condition || "").trim();
    const user = await this.userService.info();
    if (!condition || condition === "*") return true;
    if (/^fav\d+$/.test(condition)) return Number(user?.favorability || 0) >= Number(condition.slice(3));
    if (["today", "past"].includes(condition)) {
      const events = { "새해 복 많이 받아!": [1, 1], "메리 크리스마스!": [12, 25] };
      if (!events[name]) return false;
      const today = this.now(); const same = today.getMonth() + 1 === events[name][0] && today.getDate() === events[name][1];
      return condition === "today" ? same : !same;
    }
    return false;
  }
  async choose(table, name) {
    const rows = await this.messageRepository.find(table, name);
    const preferred = [], fallback = [];
    for (const row of rows) (String(row.condition || "") === "etc" ? fallback : await this.matchesCondition(row, name) ? preferred : []).push(row);
    const row = pick(preferred.length ? preferred : fallback);
    return row ? this.render(row.content) : null;
  }
  async answer(message) {
    const user = await this.userService.info(); if (!user) return null;
    const count = (this.callCounts.get(this.userService.userId) || 0) + 1;
    this.callCounts.set(this.userService.userId, count);
    const downRows = await this.messageRepository.find("LikeDown", message);
    const down = [];
    for (const row of downRows) if (await this.matchesCondition(row, message) || row.condition === "etc") down.push(row);
    const selectedDown = pick(down);
    if (selectedDown) { await this.userService.setFavorability(user.favorability - Number(selectedDown.favorability || 0)); return this.render(selectedDown.content); }
    let output = null;
    for (const table of ["TeamCloud", "Rumi", "Normal"]) { output = await this.choose(table, message); if (output) break; }
    output ||= await this.choose("Normal", null);
    if (!output) return null;
    if (count >= 10) { this.callCounts.delete(this.userService.userId); await this.userService.setFavorability(user.favorability - 10); return "내가 그만하랬지.\n💔-10"; }
    if (count >= 5) { this.callCounts.delete(this.userService.userId); await this.userService.setFavorability(user.favorability - 1); return "그만 불러요..\n💔-1"; }
    if (integer(1, 100) >= 80 && user.favorability > -999 && user.favorability < 999) { const heart = integer(1, 3); await this.userService.setFavorability(user.favorability + heart); return `${output}\n❤️+${heart}`; }
    return output;
  }
};
ConversationService.callCounts = new Map();
module.exports = ConversationService;
