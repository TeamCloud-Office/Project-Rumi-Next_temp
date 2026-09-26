module.exports = class ChannelExecutionPolicy {
  constructor({ rentalService, featureService }) { Object.assign(this, { rentalService, featureService }); }
  async allows(feature) { return await this.rentalService.check() && await this.featureService.enabled(feature); }
};
