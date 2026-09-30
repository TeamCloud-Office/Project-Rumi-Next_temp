const { isAdmin, parseInteger } = require("./_helpers");
const pattern = /^(?:방\s*등록|채널\s*등록|대여\s*등록)\s+([^\s]+)\s+([0-9,]+)(?:일)?$/;
module.exports = { name: "registerRental", matches: async ctx => ctx.hasPrefix && pattern.test(ctx.command) && await isAdmin(ctx), async execute(ctx) { const match = ctx.command.match(pattern); await ctx.send(await ctx.channelAdminService.register(match[1], parseInteger(match[2]))); return true; } };
