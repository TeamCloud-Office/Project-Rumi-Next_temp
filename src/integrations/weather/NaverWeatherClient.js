const decode = value => String(value || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const first = (html, pattern) => decode(html.match(pattern)?.[1]);
module.exports = class NaverWeatherClient {
  constructor({ fetchImpl = fetch, timeoutMs = 10000 } = {}) { Object.assign(this, { fetchImpl, timeoutMs }); }
  async get(location) {
    const response = await this.fetchImpl(`https://search.naver.com/search.naver?query=${encodeURIComponent(`${location} 날씨`)}`, { signal: AbortSignal.timeout(this.timeoutMs), headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`Naver Weather HTTP ${response.status}`);
    const html = await response.text();
    if (!html.includes("기상청")) return null;
    const title = first(html, /<h2[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i) || String(location);
    const weather = first(html, /<span[^>]*class="[^"]*weather[^\"]*before_slash[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    const temperature = first(html, /<div[^>]*class="[^"]*temperature_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i).replace("현재 온도", "").trim();
    const feel = first(html, /<dd[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/dd>/i);
    if (!weather && !temperature) return null;
    return { title, weather: weather || "정보 없음", temperature: temperature || "정보 없음", feelTemperature: feel || "정보 없음" };
  }
};
