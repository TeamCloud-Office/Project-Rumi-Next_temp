module.exports = class WeatherService {
  constructor(client) { this.client = client; }
  async get(location) {
    const weather = await this.client.get(location);
    if (!weather) return "지역을 찾을 수 없어요.";
    return [`현재 ${weather.title}의 날씨는 ${weather.weather}예요.`, `현재 온도는 ${weather.temperature}예요.`, `체감 온도는 ${weather.feelTemperature}예요.`].join("\n");
  }
};
