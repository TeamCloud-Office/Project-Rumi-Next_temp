const states = new Map();
module.exports = class Bera31Service {
  constructor({ channelId, userId, userService, repository }) { Object.assign(this, { channelId: String(channelId), userId: String(userId), userService, repository }); }
  state() { if (!states.has(this.channelId)) states.set(this.channelId, { playing: false, total: 0, turn: 0, players: [] }); return states.get(this.channelId); }
  isPlaying() { return this.state().playing; }
  async participate() { const state = this.state(); if (state.playing) return "이미 게임이 진행 중이에요!"; if (state.players.some(player => player.id === this.userId)) return "이미 참가했어요!"; const user = await this.userService.get(); state.players.push({ id: this.userId, name: user.name }); return `참가했어요!\n현재 ${state.players.length}명이 참가했어요.`; }
  async exit() { const state = this.state(); if (state.playing) return "게임 중에는 나갈 수 없어요!"; const before = state.players.length; state.players = state.players.filter(player => player.id !== this.userId); return before === state.players.length ? "참가 목록에 없어요." : `나갔어요. 현재 인원: ${state.players.length}명`; }
  async start() { const state = this.state(); if (state.playing) return "이미 진행 중이에요."; if (!state.players.some(player => player.id === this.userId)) return "게임 참여자만 시작할 수 있어요."; if (state.players.length === 1) state.players.push({ id: "bot", name: "루미" }); state.playing = true; state.total = 0; state.turn = 0; return `${state.players[0].name}부터 베라31을 시작해요! 숫자를 입력해 주세요.`; }
  async addResult(userId, win, lose) { if (userId === "bot") return; const row = await this.repository.find(userId) || { userId, win: 0, lose: 0 }; await this.repository.save({ ...row, win: Number(row.win || 0) + win, lose: Number(row.lose || 0) + lose }); }
  async input(value, ai = false) {
    const state = this.state(); if (!state.playing) return null; const current = state.players[state.turn % state.players.length];
    if (!ai && current.id !== this.userId) return `지금은 ${current.name} 차례예요.`;
    const next = Number(value); if (!Number.isInteger(next) || next <= state.total || next > state.total + 3) return `${state.total + 1}부터 ${state.total + 3} 사이의 숫자를 입력해 주세요.`;
    state.total = next;
    if (state.total >= 31) { state.playing = false; await this.addResult(current.id, 0, 1); for (const player of state.players) if (player.id !== current.id) await this.addResult(player.id, 1, 0); states.delete(this.channelId); return `펑! ${current.name}님이 31을 말해서 패배했어요!`; }
    state.turn = (state.turn + 1) % state.players.length; const upcoming = state.players[state.turn];
    if (upcoming.id === "bot") { const target = Math.min(31, state.total + (state.total % 4 === 0 ? 2 : 1)); const botMessage = await this.input(target, true); return `현재 숫자: ${next}\n루미: ${target}\n${botMessage}`; }
    return `현재 숫자: ${state.total}\n다음 차례: ${upcoming.name}`;
  }
  async ranking() { const rows = (await this.repository.list()).sort((a, b) => Number(b.win || 0) - Number(a.win || 0)); return rows.length ? `베라31 순위 TOP10\n${rows.slice(0, 10).map((row, index) => `#${index + 1} ${row.userId} - ${row.win}승 ${row.lose}패`).join("\n")}` : "아직 랭킹 데이터가 없어요."; }
};
