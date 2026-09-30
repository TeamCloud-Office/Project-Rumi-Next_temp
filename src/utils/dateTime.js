const KOREA_TIME_ZONE = "Asia/Seoul";

function parts(date = new Date()) {
  const values = new Intl.DateTimeFormat("en-CA", {
    timeZone: KOREA_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(values.map(item => [item.type, item.value]));
}

function formatDateTime(date = new Date()) {
  const value = parts(date);
  return `${value.year}-${value.month}-${value.day} ${value.hour}:${value.minute}:${value.second}`;
}

function formatKoreanDate(date = new Date()) {
  const value = parts(date);
  return `${value.year}년 ${Number(value.month)}월 ${Number(value.day)}일`;
}

function dateArray(date = new Date()) {
  const value = parts(date);
  return [Number(value.year), Number(value.month), Number(value.day)];
}

function fromDateArray(value) {
  if (!Array.isArray(value) || value.length < 3) return null;
  const [year, month, day] = value.map(Number);
  if (![year, month, day].every(Number.isFinite)) return null;
  return new Date(Date.UTC(year, month - 1, day, -9));
}

function daysUntil(value, now = new Date()) {
  const end = fromDateArray(value);
  if (!end) return null;
  return Math.ceil((end.getTime() - now.getTime()) / 86400000);
}

module.exports = { KOREA_TIME_ZONE, formatDateTime, formatKoreanDate, dateArray, fromDateArray, daysUntil };
