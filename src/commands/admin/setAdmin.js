const { isAdmin, enabled } = require("./_helpers");
const pattern = /^(?:관리자|어드민)\s+(\d+)\s+(\S+)\s+(true|false|설정|추가|지정|해제|제거|켜|꺼)$/i;
module.exports = { name: "setAdmin", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx), async execute(ctx) { const match = ctx.command.match(pattern); const result = await ctx.userAdminService.setAdmin(match[1], match[2], enabled(match[3])); await ctx.send(result ? "성공적으로 변경되었어요." : "사용자를 찾을 수 없어요."); return true; } };
