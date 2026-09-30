module.exports = class UserLookupService {
  constructor(repository) { this.repository = repository; }
  async find(channelId, value) {
    const target = String(value ?? "").trim();
    if (!target) return [];
    const rows = [];
    const privateUser = await this.repository.findByPrivateId(channelId, target);
    const publicUser = await this.repository.findByPublicId(channelId, target);
    if (privateUser) rows.push(privateUser);
    if (publicUser) rows.push(publicUser);
    rows.push(...await this.repository.findByName(channelId, target));
    return [...new Map(rows.map(row => [String(row.privateId), row])).values()];
  }
  async findOne(channelId, value) { return (await this.find(channelId, value))[0] || null; }
};
