const aliases = Object.freeze({
  입장: "join", 입장감지: "join", 들어옴: "join",
  퇴장: "leave", 퇴장감지: "leave", 나감: "leave",
  내보내기: "kick", 강퇴: "kick", 내보냄: "kick",
  삭제: "delete", 삭제감지: "delete", 메시지삭제: "delete",
  가리기: "hide", 숨김: "hide", 메시지가리기: "hide",
  프필변경: "changeProfile", 프로필변경: "changeProfile", 닉네임변경: "changeProfile", 프사변경: "changeProfile",
  출석: "attendance", 출첵: "attendance", 송금: "remittance", 이체: "remittance",
  베라: "bera", 베라31: "bera", 끝말: "word", 끝말잇기: "word",
  주식: "stock", 주식게임: "stock",
  숫자야구: "numGame", 숫자게임: "numGame", 도박: "gambling", 베팅: "gambling", 배팅: "gambling",
  날씨: "weather", 음악: "music", 노래: "music", 사전: "dictionary", 단어: "dictionary", 단어사전: "dictionary",
});
const defaults = Object.freeze(Object.fromEntries([...new Set(Object.values(aliases))].map(key => [key, false])));
const labels = Object.freeze({
  join: "입장", leave: "퇴장", kick: "내보내기", delete: "삭제", hide: "가리기",
  changeProfile: "프로필 변경", attendance: "출석", remittance: "송금", bera: "베라31", stock: "주식",
  word: "끝말잇기", numGame: "숫자야구", gambling: "도박", weather: "날씨", music: "음악", dictionary: "사전",
});
function resolveFeatureKey(value) {
  const normalized = String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  return defaults[normalized] !== undefined ? normalized : aliases[normalized] || null;
}
module.exports = { aliases, defaults, labels, resolveFeatureKey };
