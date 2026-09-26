module.exports = {
  name: "help",
  matches: ctx => ctx.hasPrefix && ["도움말", "도움말 알려줘", "도움말 보여줘", "사용법", "사용법 알려줘", "명령어", "명령어 목록", "명령어 알려줘", "명령어 보여줘", "기능", "뭐 할 수 있어", "뭐할수있어"].includes(ctx.command),
  async execute(ctx) {
    ctx.commandHistoryDescription = "도움말 조회";
    await ctx.send(["루미 명령어", "- 핑", "- 내 정보 / 유저 찾기 {이름·아이디}", "- 송금 {사용자} {금액}", "- 출석 / 출석 목록 / 내 출석", "- 도박 {금액} / 숫자야구", "- 날씨 {지역} / 음악 검색 / 사전 검색", "- 마법의 루미 {질문} / 랭킹", "- 방 정보 / 기능 켜기·끄기 / 등록 신청", "- 방장·관리자 명령은 권한이 필요해요."].join("\n"));
    return true;
  },
};
