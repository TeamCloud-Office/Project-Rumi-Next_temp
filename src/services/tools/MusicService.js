module.exports = class MusicService {
  constructor(client) { this.client = client; }
  async chart() {
    const result = await this.client.chart();
    if (!result.songs.length) return "멜론 차트 정보를 찾을 수 없어요.";
    return [`${result.date || "현재"} ${result.hour || ""} 기준 멜론 TOP30 차트에요!`.trim(), "", ...result.songs.map(song => `${song.rank}위. ${song.artist} - ${song.title}${song.album ? ` [${song.album}]` : ""}`)].join("\n");
  }
  async search(keyword) {
    const song = await this.client.search(keyword);
    if (!song) return "검색 결과가 없어요.";
    return [`${song.artist}님의 ${song.album && song.album !== song.title ? `[${song.album}] ` : ""}${song.title}`, "자세한 정보는 멜론에서 확인해보세요!", `https://www.melon.com/song/detail.htm?songId=${song.id}`].join("\n");
  }
};
