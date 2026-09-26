module.exports = class MelonClient {
  constructor({ fetchImpl = fetch, timeoutMs = 10000 } = {}) { Object.assign(this, { fetchImpl, timeoutMs }); }
  async request(url) {
    const response = await this.fetchImpl(url, { signal: AbortSignal.timeout(this.timeoutMs), headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`Melon HTTP ${response.status}`);
    return response.json();
  }
  async chart() {
    const json = (await this.request("https://m2.melon.com/m6/chart/ent/songChartList.json")).response || {};
    return { date: json.RANKDAY, hour: json.RANKHOUR, songs: (json.SONGLIST || []).slice(0, 30).map((song, index) => ({ rank: index + 1, id: song.SONGID, title: song.SONGNAME, artist: song.ARTISTLIST?.[0]?.ARTISTNAME || "아티스트 정보 없음", album: song.ALBUMNAME, releaseDate: song.ISSUEDATE })) };
  }
  async search(keyword) {
    const data = await this.request(`https://www.melon.com/search/keyword/index.json?j&query=${encodeURIComponent(keyword)}`);
    const song = data.SONGCONTENTS?.[0];
    return song ? { id: song.SONGID, title: song.SONGNAME, artist: song.ARTISTNAME, album: song.ALBUMNAME } : null;
  }
};
