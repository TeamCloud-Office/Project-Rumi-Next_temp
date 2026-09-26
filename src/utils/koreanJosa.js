const PAIRS = { "은": "는", "이": "가", "을": "를", "과": "와", "으로": "로" };
module.exports = function koreanJosa(text, pair = "이") {
  const value = String(text ?? "");
  const code = value.codePointAt(value.length - 1);
  const hasBatchim = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return `${value}${hasBatchim ? pair : (PAIRS[pair] || pair)}`;
};
