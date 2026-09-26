const ChannelRoleWatcher = require("../watchers/ChannelRoleWatcher");
const RentNoticeWatcher = require("../watchers/RentNoticeWatcher");
const ProfileWatcher = require("../watchers/ProfileWatcher");
module.exports = function startWatchers(container) {
  const common = { intervalMs: container.config.watcherIntervalMs };
  const watchers = [
    new ChannelRoleWatcher({ ...common, channelRepository: container.channelRepository, irisGateway: container.irisGateway }),
    new RentNoticeWatcher({ ...common, channelRepository: container.channelRepository, replyClient: container.replyClient }),
    new ProfileWatcher({ ...common, irisGateway: container.irisGateway, events: container.events, channelRepository: container.channelRepository }),
  ];
  return { start() { watchers.forEach(watcher => watcher.start()); }, stop() { watchers.forEach(watcher => watcher.stop()); } };
};
