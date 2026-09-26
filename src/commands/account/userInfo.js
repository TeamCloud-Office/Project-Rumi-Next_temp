const present = require("../../presenters/chat/userInfoPresenter");
const aliases = new Set(["내 정보", "내정보", "내 프로필", "내 계정", "내 계정 정보"]);

module.exports = {
  name: "userInfo",
  matches: ctx => ctx.hasPrefix && aliases.has(ctx.command),
  async execute(ctx) {
    ctx.commandHistoryDescription = "내 정보";
    await ctx.send(present(await ctx.userService.info()));
    return true;
  },
};
