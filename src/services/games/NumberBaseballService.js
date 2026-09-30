const states = new Map();
const createAnswer = random => {
  const digits = [];
  while (digits.length < 3) {
    const digit = Math.floor(random() * 10);
    if (!digits.includes(digit)) digits.push(digit);
  }
  return digits.join("");
};

module.exports = class NumberBaseballService {
  constructor({ channelId, userId, random = Math.random }) { this.key = `${channelId}:${userId}`; this.random = random; }
  isPlaying() { return states.has(this.key); }
  start() { states.set(this.key, { answer: createAnswer(this.random), attempts: 0 }); return "숫자야구를 시작했어요. 서로 다른 숫자 3개를 입력해 주세요."; }
  end() { if (!states.delete(this.key)) return "진행 중인 숫자야구가 없어요."; return "숫자야구를 종료했어요."; }
  guess(value) {
    const state = states.get(this.key);
    if (!state) return null;
    const guess = String(value);
    if (!/^\d{3}$/.test(guess) || new Set(guess).size !== 3) throw new Error("서로 다른 숫자 3개를 입력해 주세요.");
    state.attempts += 1;
    let strike = 0, ball = 0;
    for (let index = 0; index < 3; index += 1) {
      if (guess[index] === state.answer[index]) strike += 1;
      else if (state.answer.includes(guess[index])) ball += 1;
    }
    if (strike === 3) { states.delete(this.key); return `${state.attempts}번 만에 정답을 맞혔어요!`; }
    return `${strike}스트라이크 ${ball}볼`;
  }
};
