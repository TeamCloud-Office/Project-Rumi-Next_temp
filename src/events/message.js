module.exports = function createMessageHandler({ contextFactory, commandManager }) {
  return async event => {
    const ctx = contextFactory.create(event);
    return commandManager.execute(ctx);
  };
};
