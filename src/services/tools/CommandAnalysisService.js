module.exports = class CommandAnalysisService {
  constructor(client) { this.client = client; }
  async compare(standardCommand, userCommand) {
    const response = await this.client.ask("두 챗봇 명령이 같은 기능인지 판정하고 동적 값을 sub 배열에 담아 JSON만 출력하세요. 형식: {\"result\":\"유사함 또는 유사하지 않음\",\"sub\":[]}", JSON.stringify({ standardCommand, userCommand }));
    try {
      const parsed = JSON.parse(String(response).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim());
      return { result: parsed.result === "유사함" ? "유사함" : "유사하지 않음", sub: Array.isArray(parsed.sub) ? parsed.sub.map(String) : [] };
    } catch { return { result: "유사하지 않음", sub: [] }; }
  }
};
