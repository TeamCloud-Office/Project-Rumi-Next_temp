const { isCommand } = require("../../utils/CommandUtils");
const { isAdmin } = require("./_helpers");
const aliases = ["channelId", "channel id", "채널 ID", "채널 아이디", "방 ID", "방 아이디", "현재 채널 ID"];
module.exports = { name: "adminChannelId", matches: async ctx => ctx.hasPrefix && isCommand(ctx.command, aliases) && await isAdmin(ctx), async execute(ctx) { await ctx.send(`이 방의 채널 ID는 [ ${ctx.channelId} ] 이에요.`); return true; } };
