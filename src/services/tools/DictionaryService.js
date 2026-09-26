module.exports = class DictionaryService {
  constructor(client) { this.client = client; }
  async search(keyword) {
    const item = await this.client.search(keyword);
    return item ? `📖 [${item.word || keyword}]\n\t- ${item.definition || "뜻풀이가 없어요."}` : `‘${keyword}’의 사전 검색 결과가 없어요.`;
  }
};
