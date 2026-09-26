const { isAdmin, parseInteger } = require("./_helpers");
const pattern = /^(?:(?:경고|경고수)\s+(\d+)\s+(\S+)\s+([0-9,]+)|(\d+)\s+(\S+)\s+(?:경고|경고수)\s+([0-9,]+))$/;
module.exports = { name: "setWarning", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx), async execute(ctx) { const m = ctx.command.match(pattern); const result = await ctx.userAdminService.setWarning(m[1] || m[4], m[2] || m[5], parseInteger(m[3] || m[6])); await ctx.send(result ? "성공적으로 변경되었어요." : "사용자를 찾을 수 없어요."); return true; } };
