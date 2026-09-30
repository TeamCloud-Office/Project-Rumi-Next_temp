const ChannelService = require("../channel/ChannelService");
const RentalService = require("../channel/RentalService");
module.exports = class ChannelAdminService {
  constructor(channelRepository) { this.repository = channelRepository; }
  async register(channelId, days) {
    const service = new ChannelService({ repository: this.repository, channelId });
    return new RentalService(service).register(days);
  }
  async list() { return this.repository.list(); }
};
