// @ts-check
/**
 * @typedef {import('./typing').BaseLobby} BaseLobby
 */
const {
  VoiceChannel,
  Invite,
  Message,
  MessageEmbed,
  GuildMember,
} = require('discord.js');

/**
 * @implements {BaseLobby}
 */
class Lobby {
  /**
   * @readonly
   * @type {VoiceChannel}
   */
  channel;

  /**
   * @private
   * @type {Invite}
   */
  invite;

  /**
   * @private
   * @type {Message}
   */
  message;

  /**
   * @private
   * @type {MessageEmbed}
   */
  messageEmbed;

  /**
   * @readonly
   * @type {number}
   */
  index;

  /**
   * @private;
   * @type {GuildMember[]}
   */
  members = [];

  /**
   * @private
   * @type {string}
   */
  name;

  /**
   * @param {VoiceChannel} channel VoiceChannel for lobby.
   * @param {Invite} invite Invite to the VoiceChannel.
   * @param {Message} message Message with information about Lobby.
   * @param {MessageEmbed} messageEmbed MessageEmbed inside message.
   * @param {number} index Lobby index in the system.
   * @param {string} name
   */
  constructor(channel, invite, message, messageEmbed, index, name) {
    this.channel = channel;
    this.invite = invite;
    this.message = message;
    this.messageEmbed = messageEmbed;
    this.index = index;
    this.name = name;
    this.members = [];
    this.validate();
  }

  /**
   * @param {GuildMember} member
   */
  async add(member) {
    if (!(member instanceof GuildMember)) {
      throw new TypeError('member is not instance of discord.js GuildMember');
    }

    if (this.isExists(member)) {
      throw new Error('This member is aleready in the lobby.');
    }

    this.members.push(member);
    await this.update();
  }

  /**
   * @param {GuildMember} member
   */
  async remove(member) {
    if (!(member instanceof GuildMember)) {
      throw new TypeError('member is not instance of discord.js GuildMember');
    }

    const length = this.members.length;
    this.members = this.members.filter(storedMember => {
      return storedMember.id !== member.id;
    });
    if (this.members.length === length) {
      throw new Error('There are no such member.');
    }

    await this.update();
  }

  async delete() {
    this.channel.delete();
    this.message.delete();
  }

  /**
   * @param {GuildMember} member
   */
  isExists(member) {
    return !!this.members.find(stored => stored.id === member.id);
  }

  /**
   * Updates messageEmbed description.
   * @private
   */
  async update() {
    if (this.members.length < this.channel.userLimit) {
      this.messageEmbed.author.name = `${this.members.length}/${
        this.channel.userLimit
      } В поиске игроков +${this.channel.userLimit - this.members.length} ${
        this.name
      } #${this.index}`;
      this.messageEmbed.description = `${this.members
        .map(
          (member, memberIndex) => `[${memberIndex + 1}] <@${member.user.id}>`,
        )
        .join('\n')}\n Присоединиться - ${this.invite.url}`;
    } else {
      this.messageEmbed.author.name = `${this.members.length}/${this.channel.userLimit} Играют ${this.name} #${this.index}`;
      this.messageEmbed.description = `${this.members
        .map((member, memberIndex) => `[${memberIndex + 1}] <@${member.user.id}>`)
        .join('\n')}`;
    }
    this.message = await this.message.edit(this.messageEmbed);
  }

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      !(this.channel instanceof VoiceChannel) &&
        'channel must be an instance of discord.js VoiceChannel',
      !(this.invite instanceof Invite) &&
        'invite must be an instance of discord.js Invite',
      !(this.message instanceof Message) &&
        'message must be an instance of discord.js Message',
      !(this.messageEmbed instanceof MessageEmbed) &&
        'messageEmbed must be an instance of discord.js MessageEmbed',
      (typeof this.index !== 'number' || this.index < 0) &&
        'index must be positive integer',
    ].filter(error => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = Lobby;
