const { isCommand } = require("../../utils/CommandUtils");
const { isAdmin } = require("./_helpers");
const { subHosts } = require("../../services/channel/ChannelRoleService");
const { parseRent } = require("../../services/channel/RentalService");
const aliases = ["채널목록", "채널 목록", "방목록", "방 목록", "등록 채널", "등록 채널 목록"];
module.exports = { name: "channelList", matches: async ctx => ctx.hasPrefix && isCommand(ctx.command, aliases) && await isAdmin(ctx), async execute(ctx) { const rows = await ctx.channelAdminService.list(); if (!rows.length) return ctx.send("등록된 채널이 없어요."); await ctx.send([`등록된 채널 현황이에요. (${rows.length}개)`, ctx.config.more, "", ...rows.map(row => { const rent = parseRent(row.rent); return `[ ${Number(row.state) === 1 ? "💚" : "❤️"} ] ${row.name} ( ${row.id} )\n\t대여 정보: ${rent.totalDays ? `${rent.totalDays}일 남음` : "대여되지 않음"}\n\t방장: ${row.host || "없음"}\n\t부방장: ${subHosts(row.subHost).join(", ") || "없음"}\n\t관리자 메모: ${row.adminMemo || "없음"}`; })].join("\n\n")); return true; } };
