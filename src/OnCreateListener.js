// @ts-check
/**
 * @typedef {import('./typing').BaseOnCreateListener} BaseOnCreateListener
 * @typedef {import('./typing').BaseLobbyStore} BaseLobbyStore
 * @typedef {import('./typing').FactoryByCreatorId} FactoryByCreatorId
 */
const { VoiceState, VoiceChannel } = require('discord.js');

/**
 * @implements {BaseOnCreateListener}
 */
class OnCreateListener {
  /**
   * @param {BaseLobbyStore} store
   * @param {FactoryByCreatorId} factoryByCreatorId
   */
  constructor(store, factoryByCreatorId) {
    this.store = store;
    this.factoryByCreatorId = factoryByCreatorId;
    this.validate();
  }

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {VoiceChannel} creator
   */
  listen = async (oldState, newState, creator) => {
    const index = this.store.reserveIndex();
    const factory = this.factoryByCreatorId[creator.id];
    if (!factory) throw new Error('Listened to unknown channel-creator');
    const lobby = await factory.create(newState.member, index);
    this.store.save(lobby);
    newState.setChannel(lobby.channel);
  };

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      (typeof this.store.reserveIndex !== 'function' ||
        typeof this.store.save !== 'function') &&
        'store must be an instance of BaseStore',
      typeof this.factoryByCreatorId !== 'object' &&
        'factoryByCreatorId must be an key/value dict where key is creatorId and value is BaseLobbyFactory instance',
    ].filter(error => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = OnCreateListener;
