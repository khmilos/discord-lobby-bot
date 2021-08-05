// @ts-check
/**
 * @typedef {import('./typing').BaseVoiceChannelFactory} BaseVoiceChannelFactory
 */
const { GuildChannelManager, CategoryChannel } = require('discord.js');

/**
 * @implements {BaseVoiceChannelFactory}
 */
class VoiceChannelFactory {
  /**
   * @type {GuildChannelManager}
   * @private
   */
  manager;

  /**
   * @type {CategoryChannel}
   * @private
   */
  category;

  /**
   * @type {(index: number) => string}
   * @private
   */
  template;

  /**
   * @type {number}
   * @private
   */
  limit;

  /**
   * @param {GuildChannelManager} manager Instance of discord.js
   * GuildChannelManager for creating channel.
   * @param {CategoryChannel} category Where channel will be created.
   * @param {(id: number) => string} template Template function for
   * creating name for VoiceChannel.
   * @param {number} limit Maximum people in channel.
   */
  constructor(manager, category, template, limit) {
    this.manager = manager;
    this.category = category;
    this.template = template;
    this.limit = limit;
    this.validate();
  }

  /**
   * @param {number} index
   */
  create(index) {
    return this.manager.create(this.template(index), {
      type: 'voice',
      userLimit: this.limit,
      parent: this.category,
    });
  }

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      !(this.manager instanceof GuildChannelManager) &&
        'manage must be instance of discord.js GuildChannelManager',
      !(this.category instanceof CategoryChannel) &&
        'category must be instance of discord.js CategoryChannel',
      typeof this.template !== 'function' && 'template must be a function',
      (typeof this.limit !== 'number' || this.limit <= 0) &&
        'limit must be a positive number',
    ].filter(err => err);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = VoiceChannelFactory;
