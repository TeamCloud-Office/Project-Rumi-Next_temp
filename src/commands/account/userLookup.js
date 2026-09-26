const present = require("../../presenters/chat/userInfoPresenter");
const UserService = require("../../services/account/UserService");
const UserLogService = require("../../services/logging/UserLogService");
const pattern = /^유저\s*(찾기|정보|기록)\s+(?:(\d+)\s+)?(.+)$/;

async function showUser(ctx, user, { action = "find", channelId = ctx.channelId } = {}) {
  if (action !== "history") {
    const service = new UserService({ repository: ctx.userRepository, channelId, userId: user.privateId });
    return ctx.send(present(await service.info()));
  }
  if (!await ctx.userLogRepository.hasChannel(channelId)) return ctx.send(`채팅방 ID [ ${channelId} ]의 로그 데이터를 찾을 수 없어요.`);
  const userService = new UserService({ repository: ctx.userRepository, channelId, userId: user.privateId });
  const log = new UserLogService({ repository: ctx.userLogRepository, userService, channelId, userId: user.privateId });
  ctx.excludeCommandResponsesFromHistory = true;
  ctx.commandHistoryDescription = `유저 기록 조회 - ${channelId}/${user.privateId}`;
  return ctx.send(`${user.name}님의 명령어 기록이에요.\n\n${await log.commandHistoryText()}`);
}

module.exports = {
  name: "userLookup",
  matches: ctx => ctx.hasPrefix && pattern.test(ctx.command),
  async execute(ctx) {
    const [, rawAction, crossChannelId, rawValue] = ctx.command.match(pattern);
    const action = rawAction === "기록" ? "history" : "find";
    const channelId = crossChannelId || ctx.channelId;
    const value = rawValue.trim();
    if (!await ctx.userRepository.hasChannel(channelId)) return ctx.send(`채팅방 ID [ ${channelId} ]의 유저 데이터를 찾을 수 없어요.`);
    const users = await ctx.lookupService.find(channelId, value);
    if (!users.length) return ctx.send("유저 정보를 찾을 수 없어요.");
    if (users.length > 1) {
      ctx.selectionService.set(ctx.channelId, ctx.userId, { users, action, channelId });
      return ctx.send(["동명이인이 있어요. 번호를 선택해 주세요.", ...users.map((user, index) => `${index + 1}. ${user.name} (${user.publicId})`)].join("\n"));
    }
    await showUser(ctx, users[0], { action, channelId });
    return true;
  },
};
module.exports.showUser = showUser;
