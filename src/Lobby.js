// @ts-check

/**
 * @typedef {import('./typing').ILobby} ILobby
 * @typedef {import('./typing').LobbyArguments} LobbyArguments
 * @typedef {import('./typing').TemplateByLobbyKey} LobbyTemplates
 */

const {
  GuildMember,
  VoiceChannel,
  Invite,
  Message,
  MessageEmbed,
} = require('discord.js');

/**
 * Manages voice channel and message.
 * @implements {ILobby}
 */
class Lobby {
  /**
   * @type {VoiceChannel}
   * @readonly
   */
  channel;

  /**
   * @type {number | string}
   * @readonly
   */
  index;

  /**
   * Invite to voice channel.
   * @type {Invite}
   * @private
   */
  invite;

  /**
   * Message with description of lobby status.
   * @type {Message}
   * @private
   */
  message;

  /**
   * Embed inside message with description of lobby status.
   * @type {MessageEmbed}
   * @private
   */
  embed;

  /**
   * Map of templates to generate various string.
   * @type {LobbyTemplates}
   * @private
   */
  templates;

  /**
   * List of members inside lobby.
   * @type {GuildMember[]}
   * @private
   */
  members = [];

  /**
   * @param {LobbyArguments} params
   */
  constructor({ channel, invite, message, embed, index, templates }) {
    this.channel = channel;
    this.invite = invite;
    this.message = message;
    this.embed = embed;
    this.index = index;
    this.templates = templates;
    this.validate();
  }

  /**
   * @param {GuildMember} member
   * @throws {TypeError} When member is not instance of discord.js GuildMember.
   * @throws {Error} When member is already inside lobby.
   */
  add(member) {
    if (!(member instanceof GuildMember)) {
      throw new TypeError('member is not instance of discord.js GuildMember');
    }

    if (this.isExists(member)) {
      throw new Error('member is already in  lobby');
    }

    this.members.push(member);

    return this.update();
  }

  /**
   * @param {GuildMember} member
   * @throws {TypeError} When member is not instance of discord.js GuildMember.
   * @throws {Error} When member is not inside lobby.
   */
  remove(member) {
    if (!(member instanceof GuildMember)) {
      throw new TypeError('member is not instance of discord.js GuildMember');
    }

    const length = this.members.length;
    this.members = this.members.filter((member) => member.id === member.id);
    if (this.members.length === length) {
      throw new Error('member is not in lobby');
    }

    return this.update();
  }

  async delete() {
    await Promise.all([this.channel.delete(), this.message.delete()]);
  }

  /**
   * @param {GuildMember} member
   */
  isExists(member) {
    return !!this.members.find((stored) => stored.id === member.id);
  }

  /**
   * Updates embed description.
   * @private
   */
  async update() {
    this.embed.author.name = this.messageTitleTemplate.generate({
      index: this.index,
      limit: this.channel.userLimit,
      current: this.members.length,
      left: this.channel.userLimit - this.members.length,
    });
    const messageMemberTemplate = this.messageMemberTemplate;
    this.embed.description = this.members
      .map((member, index) => {
        return messageMemberTemplate.generate({
          tag: `<@${member.user.id}>`,
          index: index + 1,
        });
      })
      .join('');
    this.embed.description += this.messageLinkTemplate.generate({
      link: this.invite.url,
    });
    this.message = await this.message.edit(this.embed);
  }

  /**
   * Returns valid template for title of message.
   * @private
   */
  get messageTitleTemplate() {
    if (
      this.templates.message.titleFull &&
      this.members.length === this.channel.userLimit
    ) {
      return this.templates.message.titleFull;
    }
    return this.templates.message.title;
  }

  /**
   * Returns valid template for description member in message.
   * @private
   */
  get messageMemberTemplate() {
    if (this.templates.message.member) {
      return this.templates.message.member;
    }
    return {
      generate({ index, tag }) {
        return `[${index}] - ${tag}`;
      },
    };
  }

  /**
   * Returns valid template for generating link.
   * @private
   */
  get messageLinkTemplate() {
    if (
      this.templates.message.linkFull &&
      this.members.length === this.channel.userLimit
    ) {
      return this.templates.message.linkFull;
    }
    if (this.templates.message.link) {
      return this.templates.message.link;
    }
    return {
      generate({ link }) {
        return `Join - ${link}`;
      },
    };
  }

  /**
   * Validates properties of a class instance.
   * @private
   * @throws {TypeError} When some properties has incorrect type.
   */
  validate() {
    const errors = [
      !(this.channel instanceof VoiceChannel) &&
        'channel must be an instance of discord.js VoiceChannel',
      !(this.invite instanceof Invite) &&
        'invite must be an instance of discord.js Invite',
      !(this.message instanceof Message) &&
        'message must be an instance of discord.js Message',
      !(this.embed instanceof MessageEmbed) &&
        'embed must be an instance of discord.js MessageEmbed',
      (typeof this.index !== 'number' || typeof this.index !== 'string') &&
        'index must be positive integer',
    ].filter((error) => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = Lobby;
