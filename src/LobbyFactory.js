// @ts-check
/**
 * @typedef {import('./typing').BaseLobbyFactory} BaseLobbyFactory
 * @typedef {import('./typing').BaseVoiceChannelFactory} BaseVoiceChannelFactory
 */
const { TextChannel, MessageEmbed, GuildMember } = require('discord.js');
const Lobby = require('./Lobby');

/**
 * @implements {BaseLobbyFactory}
 */
class LobbyFactory {
  /**
   * @private
   * @type {TextChannel}
   */
  textChannel;

  /**
   * @private
   * @type {BaseVoiceChannelFactory}
   */
  channelFactory;

  /**
   * @param {TextChannel} textChannel
   * @param {BaseVoiceChannelFactory} channelFactory
   * @param {string} name
   */
  constructor(textChannel, channelFactory, name) {
    this.textChannel = textChannel;
    this.channelFactory = channelFactory;
    this.name = name;
    this.validate();
  }

  /**
   * @param {GuildMember} member
   * @param {number} index
   */
  async create(member, index) {
    const channel = await this.channelFactory.create(index);
    const invite = await channel.createInvite();
    const messageEmbed = new MessageEmbed()
      .setColor('#e0373e')
      .setAuthor(
        `0/${channel.userLimit} В поиске игроков +${channel.userLimit} ${this.name} #${index}`,
        member.user.displayAvatarURL() ?? member.user.defaultAvatarURL,
        invite.url,
      )
      .setDescription(`Присоединиться - ${invite.url}`)
      .setTimestamp();
    const message = await this.textChannel.send(messageEmbed);
    return new Lobby(channel, invite, message, messageEmbed, index, this.name);
  }

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      !(this.textChannel instanceof TextChannel) &&
        'textChannel must be an instance of discord.js TextChannel',
      typeof this.channelFactory.create !== 'function' &&
        'channelFactory must be an instance of BaseVoiceChannelFactory',
    ].filter(error => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = LobbyFactory;
