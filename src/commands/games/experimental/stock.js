const { parseInteger } = require("../../../utils/CommandUtils");
const list = /^(?:주식|주식 목록|주식 시세)$/;
const trade = /^주식\s*(구매|매수|판매|매도)\s+(.+?)\s+([0-9,]+)(?:주)?$/;
module.exports = {
  name: "stock", matches: ctx => ctx.hasPrefix && (list.test(ctx.command) || trade.test(ctx.command)),
  async execute(ctx) {
    if (!await ctx.executionPolicy.allows("stock")) return true;
    const match = ctx.command.match(trade);
    if (!match) { const rows = await ctx.stock.list(); await ctx.send(rows.length ? [`총 ${rows.length}개의 주식이 있어요.`, ...rows.map((row, index) => `${index + 1}. ${row.name}: ${Number(row.price).toLocaleString()}스타 (${Number(row.diff) >= 0 ? "+" : ""}${Number(row.diff).toLocaleString()})`)].join("\n") : "등록된 주식이 없어요."); return true; }
    const direction = ["구매", "매수"].includes(match[1]) ? "buy" : "sell"; const result = await ctx.stock.trade(match[2].trim(), parseInteger(match[3]), direction);
    await ctx.send(`"${result.stock.name}" 주식을 ${result.quantity}주 ${direction === "buy" ? "구매" : "판매"}했어요.\n${result.total.toLocaleString()}스타`); return true;
  },
};
