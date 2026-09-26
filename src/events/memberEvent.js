const UserService = require("../services/account/UserService");
const UserLogService = require("../services/logging/UserLogService");
const ChannelService = require("../services/channel/ChannelService");
const ChannelFeatureService = require("../services/channel/ChannelFeatureService");
const RentalService = require("../services/channel/RentalService");
module.exports = function createMemberHandler(container, type) {
  return async event => {
    const channel = new ChannelService({ repository: container.channelRepository, channelId: event.channel.id });
    if (!await new RentalService(channel).check() || !await new ChannelFeatureService(channel).enabled(type)) return;
    const target = type === "kick" ? event.kickedUser : event.user; if (!target?.id) return;
    const user = new UserService({ repository: container.userRepository, channelId: event.channel.id, userId: target.id });
    await user.create(target.name || target.id);
    const log = new UserLogService({ repository: container.userLogRepository, userService: user, channelId: event.channel.id, userId: target.id });
    await log.recordMemberEvent(type);
    const title = type === "join" ? `반가워요! ${target.name}님!` : type === "leave" ? `안타깝네요... ${target.name}님, 또 만나요!` : `${event.kickerUser?.name || "관리자"}님이 ${target.name}님을 내보냈어요.`;
    await container.replyClient.send(event.channel.id, [title, container.config.more, "", await log.summary()].join("\n"));
  };
};
