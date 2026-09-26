const present = require("../../presenters/chat/userInfoPresenter");
const { isAdmin } = require("./_helpers");
const pattern = /^(?:유저\s*정보|사용자\s*정보|계정\s*정보)\s+(\d+)\s+(\S+)$/;
module.exports = { name: "adminUserInfo", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx), async execute(ctx) { const match = ctx.command.match(pattern); const target = await ctx.userAdminService.resolve(match[1], match[2]); await ctx.send(target ? present(await target.service.info()) : `채팅방 ID [ ${match[1]} ]에서 사용자를 찾을 수 없어요.`); return true; } };
