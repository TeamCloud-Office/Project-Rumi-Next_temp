const { isCommand } = require("../../utils/CommandUtils");
const aliases = ["등록", "등록할래", "등록해줘", "방 등록", "방 등록해줘", "채팅방 등록", "채팅방 등록해줘", "대여 신청", "대여 신청할래", "대여 신청해줘", "루미 신청"];
module.exports = { name: "requestRegistration", matches: ctx => ctx.hasPrefix && isCommand(ctx.command, aliases), async execute(ctx) { await ctx.send(await ctx.registrationService.request(ctx.userId)); return true; } };
