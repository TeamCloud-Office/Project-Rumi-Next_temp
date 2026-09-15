module.exports = class ContextFactory {
  constructor({ config, commandParser, replyClient }) { Object.assign(this, { config, commandParser, replyClient }); }
  create(event) {
    const ctx = {
      event, config: this.config, channelId: event.channel.id, userId: event.user.id,
      ...this.commandParser.parse(event.message.content),
      commandResponses: [], commandHistoryDescription: null,
    };
    ctx.send = async text => {
      if (typeof text !== "string") throw new TypeError("Chat response must be text");
      await this.replyClient.send(ctx.channelId, text);
      ctx.commandResponses.push(text);
    };
    return ctx;
  }
};
