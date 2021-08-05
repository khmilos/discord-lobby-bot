// @ts-check
/**
 * @typedef {import('./typing').BaseOnLeaveListener} BaseOnLeaveListener
 * @typedef {import('./typing').BaseLobbyStore} BaseLobbyStore
 * @typedef {import('./typing').BaseLobby} BaseLobby
 */
const { VoiceState } = require('discord.js');

/**
 * @implements {BaseOnLeaveListener}
 */
class OnLeaveListener {
  /**
   * @type {BaseLobbyStore}
   * @private
   */
  store;

  /**
   * @param {BaseLobbyStore} store
   */
  constructor(store) {
    this.store = store;
    this.validate();
  }

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {BaseLobby} lobby
   */
  listen = (oldState, newState, lobby) => {
    if (oldState.channel.members.size !== 0) {
      lobby.remove(oldState.member);
    } else {
      lobby.delete();
      this.store.remove(lobby);
    }
  };

  /**
   * Validates class instance properties.
   * @private
   */
  validate() {
    if (typeof this.store.remove !== 'function') {
      throw new TypeError('store must be instance of BaseLobbyStore');
    }
  }
}

module.exports = OnLeaveListener;
