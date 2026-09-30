const { isCommand } = require("../../utils/CommandUtils");
const present = require("../../presenters/chat/channelInfoPresenter");
const aliases = ["여기 정보", "여기 정보 알려줘", "이 방 정보", "이 방 정보 알려줘", "방 정보", "방 정보 알려줘", "채팅방 정보", "채팅방 정보 알려줘", "방 상태", "기능 상태"];
module.exports = {
  name: "channelInfo", matches: ctx => ctx.hasPrefix && isCommand(ctx.command, aliases),
  async execute(ctx) {
    if (!await ctx.rentalService.check()) return true;
    if (!await ctx.roleService.isHost(ctx.userId)) return ctx.send("방장만 방정보를 볼 수 있어요.");
    await ctx.send(present(await ctx.channelService.get(), await ctx.featureService.list(), ctx.config.more)); return true;
  },
};
