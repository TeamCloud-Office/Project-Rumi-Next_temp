const UserService = require("../account/UserService");

module.exports = class UserAdminService {
  constructor({ userRepository, lookupService }) { Object.assign(this, { userRepository, lookupService }); }
  async resolve(channelId, value) {
    if (!await this.userRepository.hasChannel(channelId)) return null;
    const user = await this.lookupService.findOne(channelId, value);
    return user ? { user, service: new UserService({ repository: this.userRepository, channelId, userId: user.privateId }) } : null;
  }
  async setAdmin(channelId, value, enabled) { const target = await this.resolve(channelId, value); return target && target.service.setAdmin(enabled); }
  async setBan(channelId, value, enabled, reason) { const target = await this.resolve(channelId, value); return target && target.service.setBan(enabled, reason); }
  async setWarning(channelId, value, count) { const target = await this.resolve(channelId, value); return target && target.service.setWarning(count); }
  async adjustStar(channelId, value, amount) { const target = await this.resolve(channelId, value); return target && target.service.addStar(amount); }
};
