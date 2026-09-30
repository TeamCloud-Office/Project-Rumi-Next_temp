module.exports = class ChannelRegistrationService {
  constructor({ channelService, roleService, replyClient, config }) { Object.assign(this, { channelService, roleService, replyClient, config }); }
  async request(userId) {
    if (await this.channelService.isRented()) return "이미 등록된 방이에요.";
    if (!await this.roleService.isHost(userId)) return "방장만 등록 신청을 할 수 있어요.";
    const channel = await this.channelService.get();
    await this.replyClient.send(this.config.devChannelId, `> ${channel?.name || "이름 없는 채팅방"}(${channel?.id}) 방에서 대여 신청이 접수되었어요.`);
    return "등록 신청이 접수되었어요.\n잠시만 기다려주세요.";
  }
};
