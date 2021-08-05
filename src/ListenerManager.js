// @ts-check
/**
 * @typedef {import('./typing').BaseListenerManager} BaseListenerManager
 * @typedef {import('./typing').BaseLobbyStore} BaseLobbyStore
 * @typedef {import('./typing').BaseOnCreateListener} BaseOnCreateListener
 * @typedef {import('./typing').BaseOnJoinListener} BaseOnJoinListener
 * @typedef {import('./typing').BaseOnLeaveListener} BaseOnLeaveListener
 * @typedef {import('./typing').ListenersByEvent} ListenersByEvent
 */
const { Client, VoiceState, VoiceChannel } = require('discord.js');

/**
 * @implements {BaseListenerManager}
 */
class ListenerManager {
  /**
   * @type {Client}
   * @private
   */
  client;

  /**
   * @type {BaseLobbyStore}
   * @private
   */
  store;

  /**
   * @type {VoiceChannel[]}
   * @private
   */
  creators;

  /**
   * @type {BaseOnCreateListener[]}
   * @private
   */
  onCreateListeners;

  /**
   * @type {BaseOnJoinListener[]}
   * @private
   */
  onJoinListeners;

  /**
   * @type {BaseOnLeaveListener[]}
   * @private
   */
  onLeaveListeners;

  /**
   * @param {Client} client discord.js Client bot instance.
   * @param {BaseLobbyStore} store - instance of BaseLobbyStore.
   * @param {VoiceChannel[]} creators - list of instances of channel-creators.
   * After joining them will be called create-listener.
   * @param {ListenersByEvent} listenersByEvent
   */
  constructor(client, store, creators, { create, join, leave }) {
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
  listen = (oldState, newState) => {
    if (oldState.channelID === newState.channelID) return;

    const creator = this.creators.find(creator => {
      return creator.id === newState.channelID;
    });
    if (creator) {
      this.onCreateListeners.forEach(listener => {
        listener.listen(oldState, newState, creator);
      });
    }

    const joinedChannel =
      newState.channelID && this.store.find(newState.channelID);
    if (joinedChannel) {
      this.onJoinListeners.forEach(listener => {
        listener.listen(oldState, newState, joinedChannel);
      });
    }

    const leavedChannel =
      oldState.channelID && this.store.find(oldState.channelID);
    if (leavedChannel) {
      this.onLeaveListeners.forEach(listener => {
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
        'client must be instance of discord.js Client class',
    ].filter(err => err);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = ListenerManager;
