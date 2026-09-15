const parseIrisEvent = require("../../integrations/iris/IrisEventParser");
const parser = require("../middleware/irisBigIntJsonParser");
module.exports = function registerWebhook(app, { bot, irisGateway }) {
  app.post("/message", ...parser, async (req, res, next) => {
    let event;
    try { event = await parseIrisEvent(req.body, irisGateway); }
    catch (error) {
      if (error.code !== "INVALID_IRIS_WEBHOOK") return next(error);
      console.warn("Invalid Iris webhook:", error.message);
      return res.status(400).json({ ok: false, error: "Invalid Iris webhook" });
    }
    try {
      if (event) await bot.handle(event);
      res.json({ ok: true });
    } catch (error) { next(error); }
  });
};
