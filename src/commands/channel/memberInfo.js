const UserService = require("../../services/account/UserService");
const UserLogService = require("../../services/logging/UserLogService");
const present = require("../../presenters/chat/userInfoPresenter");
const direct = new Set(["정보", "정보 알려줘", "이 사람 정보", "이 사람 정보 알려줘", "답장한 사람 정보", "답장한 사람 정보 알려줘", "유저 정보", "유저 정보 알려줘", "프로필 알려줘"]);
const excluded = new Set(["내 정보", "내정보", "내 정보 알려줘", "내정보 알려줘", "내 정보 보여줘", "내 프로필", "내 프로필 알려줘", "내 계정", "내 계정 정보", "내 스탯", "여기 정보", "여기 정보 알려줘", "이 방 정보", "방 정보", "방 정보 알려줘", "채팅방 정보"]);
const pattern = /^(.+?)(?:의)?\s*(?:유저\s*)?(?:정보|프로필)(?:를)?(?:\s*(?:알려줘|알려주세요|보여줘|보여주세요|확인해줘|확인))?$/;
module.exports = {
  name: "memberInfo", matches: ctx => ctx.hasPrefix && !excluded.has(ctx.command) && (direct.has(ctx.command) || pattern.test(ctx.command)),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 유저정보를 볼 수 있어요.");
    let targetId = ctx.event.thread?.user?.id || ctx.event.message?.mention?.id; let targetName = ctx.event.thread?.user?.name || ctx.event.message?.mention?.name;
    if (!targetId && direct.has(ctx.command)) return ctx.send("답장을 해야 해요.");
    if (!targetId) { const user = await ctx.lookupService.findOne(ctx.channelId, ctx.command.match(pattern)[1].trim()); if (!user) return ctx.send("유저를 찾을 수 없어요."); targetId = user.privateId; targetName = user.name; }
    const service = new UserService({ repository: ctx.userRepository, channelId: ctx.channelId, userId: targetId });
    const log = new UserLogService({ repository: ctx.userLogRepository, userService: service, channelId: ctx.channelId, userId: targetId });
    const info = await service.info();
    await ctx.send([`[ ${targetName || info?.name} ( ${info?.publicId} ) ] 님의 정보를 알려드릴게요!`, ctx.config.more, "", present(info), "", await log.summary()].join("\n")); return true;
  },
};
