function cleanCommandText(text) {
  return String(text ?? "").normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim()
    .replace(/^[,.:;!?~。！？…]+\s*/g, "").replace(/[.!?~。！？…]+$/g, "").trim();
}
function normalizeCommand(text) { return cleanCommandText(text).replace(/\s+/g, "").toLowerCase(); }
function isCommand(command, aliases) {
  const normalized = normalizeCommand(command);
  return aliases.some(alias => normalizeCommand(alias) === normalized);
}
function parseInteger(value) {
  const text = String(value ?? "").replaceAll(",", "").trim();
  if (!/^[+-]?\d+$/.test(text)) return null;
  const number = Number(text);
  return Number.isSafeInteger(number) ? number : null;
}
module.exports = { cleanCommandText, normalizeCommand, isCommand, parseInteger };
