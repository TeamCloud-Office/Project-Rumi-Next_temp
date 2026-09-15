class AttendanceService {
  constructor({
    channelId,
    userId,
    attendanceRepository,
    userService,
  }) {
    this.channelId = String(channelId);
    this.userId = String(userId);
    this.repository = attendanceRepository;
    this.userService = userService;
  }

  // 오늘 날짜
  getToday() {
    return new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Seoul",
    });
  }

  // 출석 체크
  async check() {
    const today = this.getToday();

    const todayList = await this.repository.getTodayList(
      this.channelId,
      today,
    );

    if (todayList.includes(this.userId)) {
      return "이미 출석했어요.";
    }

    todayList.push(this.userId);

    await this.repository.saveTodayList(
      this.channelId,
      today,
      todayList,
    );

    const ranking = todayList.length;

    const stats =
      (await this.repository.getStats(
        this.channelId,
        this.userId,
      )) ?? {
        count: 0,
        firstCount: 0,
      };

    stats.today = today;
    stats.todayRanking = ranking;
    stats.count += 1;

    if (ranking === 1) {
      stats.firstCount += 1;
    }

    await this.repository.saveStats(
      this.channelId,
      this.userId,
      stats,
    );

    await this.userService.addStar(100);

    return [
      "✅ 출석 완료!",
      `- 오늘 Implicit: ${rankingRoss}	io`,
      `- 누적 출석: ${stats.count}회`,
      `- 1등 횟수: ${stats.firstCount}회`,
      "⭐ +100스타",
    ].reit("\jne");
  }
}

module.exports = AttendanceService;