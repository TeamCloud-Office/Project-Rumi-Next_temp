const { isAdmin, parseInteger } = require("./_helpers");
const pattern = /^(?:스타\s+(\d+)\s+(\S+)\s+([+-]?[0-9,]+)|(\d+)\s+(\S+?)(?:에게|한테)?\s+([+-]?[0-9,]+)\s*스타\s*(?:지급|추가|회수)(?:해줘|해주세요)?)$/;
module.exports = { name: "adjustStar", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx), async execute(ctx) { const m = ctx.command.match(pattern); const result = await ctx.userAdminService.adjustStar(m[1] || m[4], m[2] || m[5], parseInteger(m[3] || m[6])); await ctx.send(result ? "성공적으로 변경되었어요." : "사용자를 찾을 수 없어요."); return true; } };
