const UserService = require("../services/account/UserService");
const UserLogService = require("../services/logging/UserLogService");
const ChannelService = require("../services/channel/ChannelService");
const ChannelFeatureService = require("../services/channel/ChannelFeatureService");
const RentalService = require("../services/channel/RentalService");
module.exports = container => async event => {
  const channel = new ChannelService({ repository: container.channelRepository, channelId: event.channel.id });
  if (!await new RentalService(channel).check() || !await new ChannelFeatureService(channel).enabled("changeProfile") || event.previous?.nickname === event.now?.nickname) return;
  const user = new UserService({ repository: container.userRepository, channelId: event.channel.id, userId: event.user.id });
  await user.create(event.user.name || event.now.nickname || event.user.id);
  const log = new UserLogService({ repository: container.userLogRepository, userService: user, channelId: event.channel.id, userId: event.user.id });
  await log.recordNickname(event.now.nickname); await user.update({ name: event.now.nickname });
  await container.replyClient.send(event.channel.id, `${event.previous?.nickname || "알 수 없는 사용자"}님이 닉네임을 "${event.now.nickname}"으로 변경했어요.`);
};
