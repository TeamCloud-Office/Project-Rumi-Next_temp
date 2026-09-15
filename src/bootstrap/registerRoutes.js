module.exports = (app, container) => {
  require("../http/routes/irisWebhookRoute")(app, container);
  app.use(require("../http/middleware/notFoundHandler"));
  app.use(require("../http/middleware/errorHandler"));
};
