const decode = value => String(value || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1]);
module.exports = class KoreanDictionaryClient {
  constructor({ apiKey, fetchImpl = fetch, timeoutMs = 10000 } = {}) { Object.assign(this, { apiKey, fetchImpl, timeoutMs }); }
  async search(query, method = "exact") {
    if (!this.apiKey) throw Object.assign(new Error("한국어기초사전 API 키가 설정되지 않았어요."), { code: "KRDICT_API_KEY_MISSING" });
    const url = new URL("https://krdict.korean.go.kr/api/search");
    Object.entries({ key: this.apiKey, q: query, start: 1, num: 10, method, sort: "dict", part: "word" }).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await this.fetchImpl(url, { signal: AbortSignal.timeout(this.timeoutMs) });
    const xml = await response.text();
    const errorCode = tag(xml, "error_code");
    if (!response.ok || errorCode) throw Object.assign(new Error(tag(xml, "message") || `한국어기초사전 HTTP ${response.status}`), { code: errorCode || "KRDICT_HTTP_ERROR" });
    const item = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/i)?.[1];
    return item ? { word: tag(item, "word"), definition: tag(item, "definition"), link: tag(item, "link") } : null;
  }
};
