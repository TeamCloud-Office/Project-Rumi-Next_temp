module.exports = class GamblingService {
  constructor({ userService, random = Math.random }) { this.userService = userService; this.random = random; }
  async play(amount) {
    const wager = Number(amount);
    if (!Number.isSafeInteger(wager) || wager <= 0) throw new RangeError("올바른 도박 금액을 입력해 주세요.");
    const user = await this.userService.get();
    if (!user || Number(user.star || 0) < wager) throw new Error("보유 스타가 부족해요.");
    const won = this.random() < 0.45;
    const delta = won ? wager : -wager;
    if (!Number.isSafeInteger(Number(user.star || 0) + delta)) throw new RangeError("스타 잔액이 처리 가능한 범위를 초과해요.");
    const updated = await this.userService.addStar(delta);
    return { won, wager, balance: Number(updated.star || 0) };
  }
  async bet(target, amount) {
    const wager = Number(amount); const user = await this.userService.get();
    if (!Number.isSafeInteger(wager) || wager <= 0) throw new RangeError("배팅 금액이 올바르지 않아요.");
    if (!user || Number(user.star || 0) < wager) throw new Error("소지하고 있는 스타가 부족해요.");
    const choice = String(target || "").trim(); let result, multiplier;
    if (["흑", "백"].includes(choice)) { result = this.random() < 0.5 ? "흑" : "백"; multiplier = 2; }
    else if (/^[0-4]$/.test(choice)) { result = String(Math.floor(this.random() * 5)); multiplier = 4; }
    else throw new RangeError("대상은 흑/백 또는 0~4만 가능해요.");
    const won = result === choice; const delta = won ? wager * multiplier - wager : -wager;
    if (!Number.isSafeInteger(delta) || !Number.isSafeInteger(Number(user.star || 0) + delta)) throw new RangeError("스타 잔액이 처리 가능한 범위를 초과해요.");
    const updated = await this.userService.addStar(delta);
    return { won, wager, result, delta, balance: Number(updated.star || 0) };
  }
};
