// @ts-check

/**
 * @typedef {import('./typing').ILobbyFactory} ILobbyFactory
 * @typedef {import('./typing').LobbyFactoryArguments} LobbyFactoryArguments
 * @typedef {import('./typing').TemplateByLobbyKey} TemplateByLobbyKey
 */

const {
  GuildChannelManager,
  CategoryChannel,
  MessageEmbed,
  GuildMember,
  TextChannel,
} = require('discord.js');
const Lobby = require('./Lobby');
const { isTemplateByLobbyKey } = require('./typing/utils');

/**
 * Creates lobby.
 * @implements {ILobbyFactory}
 */
class LobbyFactory {
  /**
   * Used for creating voice channels.
   * @type {GuildChannelManager}
   * @private
   */
  manager;

  /**
   * Used for sending messages.
   * @type {TextChannel}
   * @private
   */
  text;

  /**
   * Parent for created voice channels.
   * @type {CategoryChannel}
   * @private
   */
  category;

  /**
   * User limit in voice channels.
   * @type {number}
   * @private
   */
  limit;

  /**
   * String generators.
   * @type {TemplateByLobbyKey}
   * @private
   */
  templates;

  /**
   * @param {LobbyFactoryArguments} params
   */
  constructor({ manager, text, category, limit, templates }) {
    this.manager = manager;
    this.text = text;
    this.category = category;
    this.limit = limit;
    this.templates = templates;
    this.validate();
  }

  /**
   * Creates lobby.
   * @param {GuildMember} member Which requested creating of voice channel.
   * @param {number | string} index Unique index among active lobbies.
   */
  async create(member, index) {
    const channel = await this.createVoiceChannel(index);
    const invite = await channel.createInvite();
    const embed = new MessageEmbed()
      .setColor('#e0373e')
      .setAuthor(
        this.templates.message.title.generate({
          index,
          limit: this.limit,
          current: 0,
          left: this.limit,
        }),
        member.user.displayAvatarURL() ?? member.user.defaultAvatarURL,
        invite.url,
      )
      .setDescription(
        this.templates.message.link.generate({ link: invite.url }),
      )
      .setTimestamp();
    const message = await this.text.send(embed);
    return new Lobby({
      channel,
      invite,
      message,
      embed,
      index,
      templates: this.templates,
    });
  }

  /**
   * Creates voice channel.
   * @param {number | string} index
   * @private
   */
  createVoiceChannel(index) {
    return this.manager.create(
      this.templates.channel.title.generate({
        index,
        limit: this.limit,
        current: 0,
        left: this.limit,
      }),
      {
        type: 'voice',
        userLimit: this.limit,
        parent: this.category,
      },
    );
  }

  /**
   * Validates properties of a class instance.
   * @private
   * @throws {TypeError} When some properties has incorrect type.
   */
  validate() {
    const errors = [
      !(this.manager instanceof GuildChannelManager) &&
        'manager must be an instance of discord.js GuildChannelManager',
      !(this.text instanceof TextChannel) &&
        'text must be an instance of discord.js TextChannel',
      !(this.category instanceof CategoryChannel) &&
        'category must be an instance of discord.js CategoryChannel',
      typeof this.limit !== 'number' && 'limit must be a number',
      !isTemplateByLobbyKey(this.templates) &&
        'templates must match TemplateByLobbyKey interface',
    ].filter(error => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = LobbyFactory;
