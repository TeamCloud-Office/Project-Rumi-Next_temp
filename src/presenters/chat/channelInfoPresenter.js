const { labels } = require("../../config/featureCatalog");
const { parseRent } = require("../../services/channel/RentalService");
module.exports = function channelInfoPresenter(channel, features, more = "") {
  if (!channel) return "채널 로그 데이터를 찾을 수 없어요.";
  if (Number(channel.state) !== 1) return [`[ ${channel.name} ] 채팅방의 정보에요.`, "채팅방 상태: 미등록", "대여 정보: 대여되지 않음", "활성화된 기능: 없음"].join("\n");
  const rent = parseRent(channel.rent);
  return [
    `[ ${channel.name} ] 채팅방의 정보에요.`, "채팅방 상태: 등록됨",
    `대여 정보: ${rent.totalDays || 0}일 남음 (시작일: ${Array.isArray(rent.startDate) ? rent.startDate.join("-") : "-"}, 종료일: ${Array.isArray(rent.endDate) ? rent.endDate.join("-") : "-"})`,
    "활성화된 기능:", more, "",
    ...Object.entries(features).filter(([key]) => !["bera"].includes(key)).map(([key, value]) => `${labels[key] || key} : ${value ? "⭕" : "❌"}`).sort((a, b) => a.localeCompare(b, "ko")),
  ].join("\n");
};
