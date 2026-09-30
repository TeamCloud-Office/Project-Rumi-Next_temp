const UserService = require("../../services/account/UserService");
const UserLogService = require("../../services/logging/UserLogService");
const pattern = /^(.+?)(?:의|에게|한테)?\s*(?:닉네임|닉넴|닉변)\s*(?:(?:수정|변경)\s*)?(?:기록|내역|이력)(?:을|를)?(?:\s*(?:알려줘|알려주세요|보여줘|보여주세요|확인해줘|확인|열람))?$/;
module.exports = {
  name: "nicknameHistory", matches: ctx => ctx.hasPrefix && pattern.test(ctx.command),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 닉네임 수정 기록을 볼 수 있어요.");
    const user = ctx.event.message?.mention?.id ? await ctx.userRepository.findByPrivateId(ctx.channelId, ctx.event.message.mention.id) : await ctx.lookupService.findOne(ctx.channelId, ctx.command.match(pattern)[1].trim());
    if (!user) return ctx.send("유저를 찾을 수 없어요.");
    const service = new UserService({ repository: ctx.userRepository, channelId: ctx.channelId, userId: user.privateId });
    const log = new UserLogService({ repository: ctx.userLogRepository, userService: service, channelId: ctx.channelId, userId: user.privateId });
    await ctx.send([`[ ${user.name} ( ${user.publicId} ) ] 님의 기록이에요.`, ctx.config.more, "", await log.nicknameHistoryText()].join("\n")); return true;
  },
};
