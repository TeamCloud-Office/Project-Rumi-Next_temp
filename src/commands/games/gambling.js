const { parseInteger } = require("../../utils/CommandUtils");
const simple = /^(?:도박|스타 도박)\s+([0-9,]+)$/;
const targetFirst = /^(.+?)에\s*([0-9,]+)스타\s*도박해줘$/;
const short = /^도박\s+(흑|백|[0-4])\s+([0-9,]+)(?:스타)?$/;
module.exports = {
  name: "gambling",
  matches: ctx => ctx.hasPrefix && (simple.test(ctx.command) || targetFirst.test(ctx.command) || short.test(ctx.command)),
  async execute(ctx) {
    if (!(await ctx.channelService.isRented()) || !(await ctx.channelService.featureEnabled("gambling"))) return true;
    const targeted = ctx.command.match(targetFirst) || ctx.command.match(short);
    const result = targeted ? await ctx.gambling.bet(targeted[1], parseInteger(targeted[2])) : await ctx.gambling.play(parseInteger(ctx.command.match(simple)[1]));
    await ctx.send(targeted
      ? [`🎲 ${result.won ? "승리!" : "패배..."}`, `결과: ${result.result}`, `${Math.abs(result.delta).toLocaleString()}스타를 ${result.won ? "얻었어요!" : "잃었어요."}`, `${result.balance.toLocaleString()}스타 남았어요.`].join("\n")
      : result.won ? `${result.wager.toLocaleString()}스타를 얻었어요! 잔액: ${result.balance.toLocaleString()}스타` : `${result.wager.toLocaleString()}스타를 잃었어요. 잔액: ${result.balance.toLocaleString()}스타`);
    return true;
  },
};
