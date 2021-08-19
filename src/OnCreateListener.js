// @ts-check

/**
 * @typedef {import('./typing').IOnCreateListener} IOnCreateListener
 * @typedef {import('./typing').IStore} IStore
 * @typedef {import('./typing').LobbyFactoryByChannelId} LobbyFactoryByChannelId
 */

const { VoiceState, VoiceChannel } = require('discord.js');
const { isIStore, isLobbyFactoryByChannelId } = require('./typing/utils');

/**
 * Listens to `voiceStateUpdate` event parsed as create voice channel event.
 * @implements {IOnCreateListener}
 */
class OnCreateListener {
  /**
   * @type {IStore}
   * @private
   */
  store;

  /**
   * @type {LobbyFactoryByChannelId}
   * @private
   */
  factoryByChannelId;

  /**
   * @param {IStore} store
   * @param {LobbyFactoryByChannelId} factoryByChannelId
   */
  constructor(store, factoryByChannelId) {
    this.store = store;
    this.factoryByChannelId = factoryByChannelId;
    this.validate();
  }

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {VoiceChannel} creator
   */
  listen = async (oldState, newState, creator) => {
    const index = await this.store.reserveIndex();
    const factory = this.factoryByChannelId[creator.id];
    if (!factory) throw new Error('Listened to unknown channel-creator');
    const lobby = await factory.create(newState.member, index);
    await this.store.save(lobby);
    newState.setChannel(lobby.channel);
  };

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      !isLobbyFactoryByChannelId(this.factoryByChannelId) &&
        'factoryByChannelId must match LobbyFactoryByChannelId',
      !isIStore(this.store) && 'store must match IStore interface',
    ].filter((error) => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = OnCreateListener;
