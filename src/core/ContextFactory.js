const UserService = require("../services/account/UserService");
const ChannelService = require("../services/channel/ChannelService");
const AttendanceService = require("../services/games/AttendanceService");
const GamblingService = require("../services/games/GamblingService");
const NumberBaseballService = require("../services/games/NumberBaseballService");
const RankingService = require("../services/conversation/RankingService");
const UserLogService = require("../services/logging/UserLogService");
const ChannelFeatureService = require("../services/channel/ChannelFeatureService");
const ChannelRoleService = require("../services/channel/ChannelRoleService");
const ChannelExecutionPolicy = require("../services/channel/ChannelExecutionPolicy");
const ChannelRegistrationService = require("../services/channel/ChannelRegistrationService");
const RentalService = require("../services/channel/RentalService");
const MagicAnswerService = require("../services/conversation/MagicAnswerService");
const ConversationService = require("../services/conversation/ConversationService");
const Bera31Service = require("../services/games/Bera31Service");
const StockService = require("../services/games/StockService");
const WordChainService = require("../services/games/WordChainService");

module.exports = class ContextFactory {
  constructor(dependencies) { Object.assign(this, dependencies); }
  async create(event) {
    const ctx = {
      event, config: this.config, channelId: event.channel.id, userId: event.user.id,
      ...this.commandParser.parse(event.message.content),
      commandResponses: [], commandHistoryDescription: null, excludeCommandResponsesFromHistory: false,
    };
    ctx.send = async text => {
      if (typeof text !== "string") throw new TypeError("Chat response must be text");
      await this.replyClient.send(ctx.channelId, text);
      ctx.commandResponses.push(text);
    };
    ctx.UserService = UserService;
    ctx.userRepository = this.userRepository;
    ctx.userLogRepository = this.userLogRepository;
    ctx.lookupService = this.lookupService;
    ctx.selectionService = this.selectionService;
    ctx.memberMemoService = this.memberMemoService;
    ctx.userAdminService = this.userAdminService;
    ctx.channelAdminService = this.channelAdminService;
    ctx.broadcastService = this.broadcastService;
    ctx.weatherService = this.weatherService;
    ctx.musicService = this.musicService;
    ctx.dictionaryService = this.dictionaryService;
    ctx.userService = new UserService({ repository: this.userRepository, channelId: ctx.channelId, userId: ctx.userId });
    ctx.channelService = new ChannelService({ repository: this.channelRepository, channelId: ctx.channelId });
    ctx.featureService = new ChannelFeatureService(ctx.channelService);
    ctx.rentalService = new RentalService(ctx.channelService);
    ctx.roleService = new ChannelRoleService(ctx.channelService);
    ctx.executionPolicy = new ChannelExecutionPolicy({ rentalService: ctx.rentalService, featureService: ctx.featureService });
    ctx.registrationService = new ChannelRegistrationService({ channelService: ctx.channelService, roleService: ctx.roleService, replyClient: this.replyClient, config: this.config });
    ctx.transferService = this.transferService;
    ctx.attendance = new AttendanceService({ channelId: ctx.channelId, userId: ctx.userId, attendanceRepository: this.attendanceRepository, userService: ctx.userService });
    ctx.gambling = new GamblingService({ userService: ctx.userService });
    ctx.numberBaseball = new NumberBaseballService({ channelId: ctx.channelId, userId: ctx.userId });
    ctx.bera = new Bera31Service({ channelId: ctx.channelId, userId: ctx.userId, userService: ctx.userService, repository: this.beraRepository });
    ctx.stock = new StockService({ repository: this.stockRepository, userService: ctx.userService, config: this.config });
    ctx.wordChain = new WordChainService({ channelId: ctx.channelId, userId: ctx.userId, userService: ctx.userService, dictionaryClient: this.dictionaryClient });
    ctx.ranking = new RankingService(this.userRepository);
    if (ctx.hasPrefix && ["ping", "핑"].includes(String(ctx.command).toLowerCase())) return ctx;
    const channel = await ctx.channelService.ensure(event.channel?.name);
    if (Number(event.user?.type) === 1 && String(channel.host || "") !== ctx.userId) {
      await ctx.roleService.sync(ctx.userId, require("../services/channel/ChannelRoleService").subHosts(channel.subHost));
    } else if (Number(event.user?.type) === 4) {
      const subHosts = require("../services/channel/ChannelRoleService").subHosts(channel.subHost);
      if (!subHosts.includes(ctx.userId)) await ctx.roleService.sync(channel.host, [...subHosts, ctx.userId]);
    }
    await ctx.userService.create(event.user?.name || ctx.userId);
    ctx.userLog = new UserLogService({ repository: this.userLogRepository, userService: ctx.userService, channelId: ctx.channelId, userId: ctx.userId });
    await ctx.userLog.ensure();
    ctx.magicAnswerService = new MagicAnswerService(this.magicAnswerRepository);
    ctx.conversationService = new ConversationService({ messageRepository: this.messageRepository, userService: ctx.userService });
    ctx.isBanned = Boolean((await ctx.userService.get())?.ban);
    return ctx;
  }
};
