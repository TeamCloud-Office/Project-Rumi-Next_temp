const Config = require("../config/Config");
const IrisClient = require("../integrations/iris/IrisClient");
const IrisReplyClient = require("../integrations/iris/IrisReplyClient");
const IrisQueryClient = require("../integrations/iris/IrisQueryClient");
const IrisGateway = require("../integrations/iris/IrisGateway");
const CommandParser = require("../core/CommandParser");
const CommandManager = require("../core/CommandManager");
const ContextFactory = require("../core/ContextFactory");
const EventManager = require("../core/EventManager");
module.exports = function createContainer({ config = new Config(), replyClient } = {}) {
  const irisClient = new IrisClient(config);
  const container = {
    config, irisClient, replyClient: replyClient || new IrisReplyClient(irisClient),
    queryClient: new IrisQueryClient(irisClient), commandParser: new CommandParser(config.commandPrefixes),
    commandManager: new CommandManager(), events: new EventManager(),
  };
  container.irisGateway = new IrisGateway(container.queryClient);
  container.contextFactory = new ContextFactory(container);
  return container;
};
