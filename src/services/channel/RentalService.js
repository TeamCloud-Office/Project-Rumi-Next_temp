const { dateArray, daysUntil } = require("../../utils/dateTime");

function parseRent(value) {
  try { return { startDate: "", endDate: "", totalDays: 0, ...(JSON.parse(value || "{}") || {}) }; }
  catch { return { startDate: "", endDate: "", totalDays: 0 }; }
}

module.exports = class RentalService {
  constructor(channelService) { this.channelService = channelService; }
  async check(now = new Date()) {
    const channel = await this.channelService.get();
    if (!channel || Number(channel.state) !== 1) return false;
    const rent = parseRent(channel.rent);
    const left = daysUntil(rent.endDate, now);
    if (left === null || left <= 0) {
      await this.channelService.update({ state: 0, rent: JSON.stringify({ startDate: "", endDate: "", totalDays: 0 }) });
      return false;
    }
    if (rent.totalDays !== left) await this.channelService.update({ rent: JSON.stringify({ ...rent, totalDays: left }) });
    return true;
  }
  async register(days, now = new Date()) {
    const value = Number(days);
    if (!Number.isSafeInteger(value) || value <= 0) return "대여 기간은 1일 이상이어야 해요.";
    if (!await this.channelService.get()) return "채널 로그 데이터를 찾을 수 없어요.";
    const end = new Date(now.getTime()); end.setDate(end.getDate() + value);
    await this.channelService.update({ state: 1, rent: JSON.stringify({ startDate: dateArray(now), endDate: dateArray(end), totalDays: value }) });
    return `채팅방이 등록되었어요. ${value}일`;
  }
  async unregister() {
    if (!await this.channelService.get()) return "채널 로그 데이터를 찾을 수 없어요.";
    await this.channelService.update({ state: 0, rent: JSON.stringify({ startDate: "", endDate: "", totalDays: 0 }) });
    return "채팅방이 해지되었어요.";
  }
  async notice(noticeDays = 3, now = new Date()) {
    const channel = await this.channelService.get();
    if (!channel || Number(channel.state) !== 1) return null;
    const rent = parseRent(channel.rent);
    return daysUntil(rent.endDate, now) === Number(noticeDays)
      ? `[ ${channel.name} ] 채팅방의 대여 종료까지 ${noticeDays}일 남았어요.` : null;
  }
};
module.exports.parseRent = parseRent;
