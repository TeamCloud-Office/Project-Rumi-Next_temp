module.exports = class MemberMemoService {
  constructor(userLogRepository) { this.repository = userLogRepository; }
  async set(channelId, userId, memo) {
    const row = await this.repository.find(channelId, userId);
    if (!row) return "유저 로그 데이터를 찾을 수 없어요.";
    await this.repository.save(channelId, { ...row, memo: String(memo) });
    return "메모가 저장되었어요.";
  }
  async clear(channelId, userId) {
    const row = await this.repository.find(channelId, userId);
    if (!row) return "유저 로그 데이터를 찾을 수 없어요.";
    await this.repository.save(channelId, { ...row, memo: null });
    return "메모가 삭제되었어요.";
  }
};
