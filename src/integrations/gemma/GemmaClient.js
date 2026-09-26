module.exports = class GemmaClient {
  constructor({ apiKey, fetchImpl = fetch, timeoutMs = 30000 } = {}) { Object.assign(this, { apiKey, fetchImpl, timeoutMs }); }
  async ask(systemPrompt, userPrompt) {
    if (!this.apiKey) throw Object.assign(new Error("Gemma API 키가 설정되지 않았어요."), { code: "GEMMA_API_KEY_MISSING" });
    const response = await this.fetchImpl("https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent", {
      method: "POST", signal: AbortSignal.timeout(this.timeoutMs), headers: { "Content-Type": "application/json", "x-goog-api-key": this.apiKey },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: "user", parts: [{ text: userPrompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 200 } }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body?.error?.message || `Gemma HTTP ${response.status}`);
    return body.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").trim() || "";
  }
};
