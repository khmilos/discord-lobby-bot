// @ts-check

/**
 * @typedef {import('./typing').IListenerManager} IListenerManager
 * @typedef {import('./typing').IStore} IStore
 * @typedef {import('./typing').IOnCreateListener} IOnCreateListener
 * @typedef {import('./typing').IOnJoinListener} IOnJoinListener
 * @typedef {import('./typing').IOnLeaveListener} IOnLeaveListener
 * @typedef {import('./typing').ListenersByCustomEvent} ListenersByCustomEvent
 * @typedef {import('./typing').ListenerManagerArguments}
 *  ListenerManagerArguments
 */

const { Client, VoiceState, VoiceChannel } = require('discord.js');
const { isIStore, isIListener } = require('./typing/utils');

/**
 * Manages listeners to `voiceStateUpdate` event.
 * @implements {IListenerManager}
 */
class ListenerManager {
  /**
   * @type {Client}
   * @private
   */
  client;

  /**
   * @type {IStore}
   * @private
   */
  store;

  /**
   * @type {VoiceChannel[]}
   * @private
   */
  creators;

  /**
   * @type {IOnCreateListener[]}
   * @private
   */
  onCreateListeners;

  /**
   * @type {IOnJoinListener[]}
   * @private
   */
  onJoinListeners;

  /**
   * @type {IOnLeaveListener[]}
   * @private
   */
  onLeaveListeners;

  /**
   * @param {ListenerManagerArguments} arg
   */
  constructor({
    client,
    store,
    creators,
    listenersByEvent: { create, join, leave },
  }) {
    this.client = client;
    this.store = store;
    this.creators = creators;
    this.onCreateListeners = create ?? [];
    this.onJoinListeners = join ?? [];
    this.onLeaveListeners = leave ?? [];
    this.validate();
  }

  start() {
    this.client.on('voiceStateUpdate', this.listen);
  }

  stop() {
    this.client.off('voiceStateUpdate', this.listen);
  }

  /**
   * Listens to the voiceStateUpdate. It calls specified listeners according
   * to the member actions:
   * * joined channel-creator;
   * * joined channel-lobby;
   * * leaved channel-lobby.
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @private
   */
  listen = async (oldState, newState) => {
    if (oldState.channelID === newState.channelID) return;

    const creator = this.creators.find((creator) => {
      return creator.id === newState.channelID;
    });
    if (creator) {
      this.onCreateListeners.forEach((listener) => {
        listener.listen(oldState, newState, creator);
      });
    }

    const joinedChannel =
      newState.channelID && (await this.store.find(newState.channelID));
    if (joinedChannel) {
      this.onJoinListeners.forEach((listener) => {
        listener.listen(oldState, newState, joinedChannel);
      });
    }

    const leavedChannel =
      oldState.channelID && (await this.store.find(oldState.channelID));
    if (leavedChannel) {
      this.onLeaveListeners.forEach((listener) => {
        listener.listen(oldState, newState, leavedChannel);
      });
    }
  };

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    const errors = [
      !(this.client instanceof Client) &&
        'client must be an instance of discord.js Client class',
      !isIStore(this.store) && 'store must match an IStore interface',
      this.creators.some((creator) => !(creator instanceof VoiceChannel)) &&
        'creators must be an Array of VoiceChannel',
      this.onCreateListeners.some((listener) => !isIListener(listener)) &&
        'Listeners to create event must match IListener interface',
      this.onJoinListeners.some((listener) => !isIListener(listener)) &&
        'Listeners to create event must match IListener interface',
      this.onLeaveListeners.some((listener) => !isIListener(listener)) &&
        'Listeners to create event must match IListener interface',
    ].filter((error) => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = ListenerManager;
