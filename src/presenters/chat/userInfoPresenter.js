module.exports = user => {
  if (!user) return "유저 정보를 찾을 수 없어요.";
  return [
    `닉네임: ${user.name}`,
    `아이디: ${user.publicId}`,
    `가입일: ${user.signupDate}`,
    `상태: ${user.ban ? "차단됨" : "정상"}`,
    ...(user.ban ? [`정지 날짜: ${user.banDate || "기록 없음"}`, `정지 사유: ${user.banReason || "등록된 사유 없음"}`] : []),
    `경고 횟수: ${user.warn}회`,
    `보유 스타: ${user.star.toLocaleString()}스타`,
    `호감도: ${user.favorability.toLocaleString()}`,
    `보유 배지: ${user.badges.length ? user.badges.join(", ") : "없음"}`,
  ].join("\n");
};
