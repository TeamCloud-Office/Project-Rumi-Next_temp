const { formatDateTime } = require("../../utils/dateTime");
const stringify = value => JSON.stringify(value);
const parse = (value, fallback) => { try { return JSON.parse(value || "") ?? fallback; } catch { return fallback; } };
module.exports = class UserLogService {
  constructor({ repository, userService, channelId, userId }) { Object.assign(this, { repository, userService, channelId: String(channelId), userId: String(userId) }); }
  async ensure() {
    let row = await this.repository.find(this.channelId, this.userId);
    if (row) return row;
    const user = await this.userService.get();
    row = { userId: this.userId, id: user?.publicId || "", name: user?.name || this.userId, join: stringify({ firstJoin: null, recentJoin: null, count: 0 }), leave: stringify({ recentLeave: null, count: 0 }), kick: stringify({ recentKick: null, count: 0 }), chat: stringify({ first: null, recent: null, count: 0 }), commandHistory: stringify({ commandHistory: [] }), nicknameHistory: "[]", memo: null };
    return this.repository.save(this.channelId, row);
  }
  async logMessage(content) {
    const row = await this.ensure();
    let chat; try { chat = JSON.parse(row.chat || "{}"); } catch { chat = {}; }
    const item = { content: String(content).slice(0, 500), time: new Date().toISOString() };
    chat.first ||= item; chat.recent = item; chat.count = Number(chat.count || 0) + 1;
    await this.repository.save(this.channelId, { ...row, chat: stringify(chat) });
  }
  async logCommand(description, responses) {
    const row = await this.ensure();
    let value; try { value = JSON.parse(row.commandHistory || "{}"); } catch { value = {}; }
    const history = Array.isArray(value.commandHistory) ? value.commandHistory : [];
    history.push({ date: new Date().toISOString(), command: String(description).slice(0, 500), response: responses.slice(0, 3).map(text => String(text).replace(/\u200b/g, "").slice(0, 500)), status: "success" });
    value.commandHistory = history.slice(-200);
    await this.repository.save(this.channelId, { ...row, commandHistory: stringify(value) });
  }
  async recordMemberEvent(type) {
    if (!["join", "leave", "kick"].includes(type)) throw new TypeError("Invalid member event");
    const row = await this.ensure();
    const fallback = type === "join" ? { firstJoin: null, recentJoin: null, count: 0 } : { [`recent${type[0].toUpperCase()}${type.slice(1)}`]: null, count: 0 };
    const value = parse(row[type], fallback);
    const key = type === "join" ? "recentJoin" : type === "leave" ? "recentLeave" : "recentKick";
    if (type === "join" && !value.firstJoin) value.firstJoin = formatDateTime();
    value[key] = formatDateTime(); value.count = Number(value.count || 0) + 1;
    const patch = { [type]: stringify(value) };
    if (type === "kick") {
      const leave = parse(row.leave, { recentLeave: null, count: 0 });
      leave.recentLeave = formatDateTime(); leave.count = Number(leave.count || 0) + 1;
      patch.leave = stringify(leave);
    }
    await this.repository.save(this.channelId, { ...row, ...patch });
  }
  async recordNickname(name) {
    const row = await this.ensure();
    const history = parse(row.nicknameHistory, []);
    if (row.name !== name) history.push({ before: row.name, after: String(name), time: formatDateTime() });
    await this.repository.save(this.channelId, { ...row, name: String(name), nicknameHistory: stringify(history.slice(-100)) });
  }
  async setMemo(memo) { const row = await this.ensure(); await this.repository.save(this.channelId, { ...row, memo: String(memo) }); }
  async clearMemo() { const row = await this.ensure(); await this.repository.save(this.channelId, { ...row, memo: null }); }
  async nicknameHistoryText() {
    const row = await this.ensure(); const history = parse(row.nicknameHistory, []);
    return history.length ? [
      `닉네임 수정 기록 (${history.length}건):`,
      ...history.map(item => `\t- [${item.time || "시각 알 수 없음"}] ${item.before || "알 수 없음"} → ${item.after || "알 수 없음"}`),
    ].join("\n") : "닉네임 수정 기록이 없어요.";
  }
  async commandHistoryText() {
    const row = await this.ensure();
    const entries = parse(row.commandHistory, {}).commandHistory || [];
    if (!entries.length) return "명령어 사용 기록이 없어요.";
    return [`명령어 사용 기록 (총 ${entries.length}건)`, ...entries.slice().reverse().map(entry => {
      const response = (entry.response || entry.responses || []).map(String).filter(Boolean).slice(0, 3).join(" / ");
      return `[${entry.date || "날짜 알 수 없음"}] ${entry.status === "error" ? "실패" : "성공"} · ${entry.command || "명령어 알 수 없음"}${response ? `\n응답: ${response}` : ""}`;
    })].join("\n\n");
  }
  async summary() {
    const row = await this.ensure();
    const join = parse(row.join, {}), leave = parse(row.leave, {}), kick = parse(row.kick, {}), chat = parse(row.chat, {});
    return [
      "입장 기록:", `\t- 최초 입장: ${join.firstJoin || "알 수 없음"}`, `\t- 최근 입장: ${join.recentJoin || "알 수 없음"}`, `\t- 총 입장 횟수: ${Number(join.count || 0)}회`,
      "퇴장 기록:", `\t- 최근 퇴장: ${leave.recentLeave || "알 수 없음"}`, `\t- 총 퇴장 횟수: ${Number(leave.count || 0)}회`,
      "내보내기 기록:", `\t- 최근 내보내기: ${kick.recentKick || "알 수 없음"}`, `\t- 총 내보내기 횟수: ${Number(kick.count || 0)}회`,
      "채팅 기록:", `\t- 최초 채팅: ${chat.first?.content || "알 수 없음"}`, `\t- 최근 채팅: ${chat.recent?.content || "알 수 없음"}`, `\t- 총 채팅 횟수: ${Number(chat.count || 0)}회`,
      `메모: ${row.memo || "없음"}`,
    ].join("\n");
  }
};
