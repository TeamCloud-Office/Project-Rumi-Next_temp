module.exports = class RankingService {
  constructor(userRepository) { this.users = userRepository; }
  async get(channelId, limit = 10) {
    return (await this.users.list(channelId)).sort((a, b) => Number(b.star || 0) - Number(a.star || 0)).slice(0, limit);
  }
};
