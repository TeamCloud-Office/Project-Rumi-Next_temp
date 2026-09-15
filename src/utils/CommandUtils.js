function cleanCommandText(text) {
  return String(text ?? "").normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim()
    .replace(/^[,.:;!?~。！？…]+\s*/g, "").replace(/[.!?~。！？…]+$/g, "").trim();
}
module.exports = { cleanCommandText };
