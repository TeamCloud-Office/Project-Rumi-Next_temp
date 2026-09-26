const { parseInteger } = require("../../utils/CommandUtils");
const patterns = [
  /^(.+?)(?:에게|한테|께)\s*([0-9,]+)\s*(?:원|스타)?\s*(?:(?:송금|이체)(?:해줘|해주세요|해|할래)?|보내줘|보내주세요|보내)$/,
  /^(?:송금|이체)(?:해줘|해주세요|할래)?\s+(.+?)\s+([0-9,]+)\s*(?:원|스타)?$/,
  /^(.+?)\s+([0-9,]+)\s*(?:원|스타)\s*(?:(?:송금|이체)(?:해줘|해주세요)?|보내줘|보내주세요)$/,
  /^(.+?)(?:에게|한테|께)\s*(?:송금|이체|전송)\s*([0-9,]+)\s*(?:원|스타)?$/,
];
const amountFirst = /^([0-9,]+)\s*(?:원|스타)\s+(.+?)(?:에게|한테|께)\s*(?:(?:송금|이체)(?:해줘|해주세요)?|보내줘|보내주세요)$/;
const find = value => patterns.map(pattern => value.match(pattern)).find(Boolean);

module.exports = {
  name: "transfer",
  matches(ctx) { return ctx.hasPrefix && (Boolean(find(ctx.command)) || amountFirst.test(ctx.command)); },
  async execute(ctx) {
    if (!(await ctx.channelService.isRented()) || !(await ctx.channelService.featureEnabled("remittance"))) return true;
    const normal = find(ctx.command), reversed = ctx.command.match(amountFirst);
    const target = normal?.[1] || reversed?.[2], rawAmount = normal?.[2] || reversed?.[1];
    const mentioned = ctx.event.message?.mention?.id;
    const result = await ctx.transferService.transfer(ctx.channelId, ctx.userId, mentioned || target.trim(), parseInteger(rawAmount));
    ctx.commandHistoryDescription = `송금 - ${result.receiver.privateId}`;
    await ctx.send(`${result.receiver.name}님께 ${result.amount.toLocaleString()}스타를 송금했어요.`);
    return true;
  },
};
