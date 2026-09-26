const ChannelService = require("../services/channel/ChannelService");
const ChannelFeatureService = require("../services/channel/ChannelFeatureService");
const RentalService = require("../services/channel/RentalService");
module.exports = function createHandler(container, type) {
  return async event => {
    const channel = new ChannelService({ repository: container.channelRepository, channelId: event.channel.id });
    if (!await new RentalService(channel).check() || !await new ChannelFeatureService(channel).enabled(type)) return;
    const message = type === "delete" ? `${event.user?.name || "사용자"}님이 "${event.message?.content || ""}"를 지웠어요.` : `${event.user?.name || "사용자"}님이 메시지를 가렸어요.`;
    await container.replyClient.send(event.channel.id, message);
  };
};
