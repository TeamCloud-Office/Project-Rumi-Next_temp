module.exports = class TransferService {
  constructor({ userRepository, config }) {
    this.users = userRepository;
    this.config = config;
  }
  async transfer(channelId, senderId, target, amount) {
    const value = Number(amount);
    if (!Number.isSafeInteger(value) || value <= 0 || value > 99_999_999) throw new RangeError("올바른 송금 금액을 입력해 주세요.");
    const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", hour12: false }).format(new Date()));
    if (hour < this.config.bankHours[0] || hour >= this.config.bankHours[1]) throw new Error(`은행 업무 시간은 ${this.config.bankHours[0]}시부터 ${this.config.bankHours[1]}시까지예요.`);
    const sender = await this.users.findByPrivateId(channelId, senderId);
    const receiver = await this.users.findByPrivateId(channelId, target) || await this.users.findByPublicId(channelId, target) || (await this.users.findByName(channelId, target))[0];
    if (!sender || !receiver) throw new Error("송금할 사용자를 찾을 수 없어요.");
    if (String(sender.privateId) === String(receiver.privateId)) throw new Error("자기 자신에게는 송금할 수 없어요.");
    if (Number(sender.star || 0) < value) throw new Error("보유 스타가 부족해요.");
    await this.users.save(channelId, { ...sender, star: Number(sender.star || 0) - value });
    try { await this.users.save(channelId, { ...receiver, star: Number(receiver.star || 0) + value }); }
    catch (error) { await this.users.save(channelId, sender); throw error; }
    return { receiver, amount: value };
  }
};
