const createContainer = require("./createContainer");
const createServer = require("../http/createServer");
const Bot = require("../core/Bot");
module.exports = function createApplication(options = {}) {
  const container = createContainer(options);
  const app = createServer();
  const bot = new Bot({ app, config: container.config, events: container.events });
  require("./registerCommands")(container);
  require("./registerEvents")(container);
  require("./registerRoutes")(app, { ...container, bot });
  const watchers = require("./startWatchers")(container);
  bot.onStart(() => watchers.start());
  bot.onStop(() => watchers.stop());
  return { app, bot, container };
};
