// @ts-check

/**
 * @typedef {import('./typing').IOnLeaveListener} IOnLeaveListener
 * @typedef {import('./typing').IStore} IStore
 * @typedef {import('./typing').ILobby} ILobby
 */

const { VoiceState } = require('discord.js');
const { isIStore } = require('./typing/utils');

/**
 * Listens to `voiceStateUpdate` event parsed as leave voice channel event.
 * @implements {IOnLeaveListener}
 */
class OnLeaveListener {
  /**
   * @type {IStore}
   * @private
   */
  store;

  /**
   * @param {IStore} store
   */
  constructor(store) {
    this.store = store;
    this.validate();
  }

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {ILobby} lobby
   */
  listen = async (oldState, newState, lobby) => {
    if (oldState.channel.members.size !== 0) {
      await lobby.remove(oldState.member);
    } else {
      await lobby.delete();
      await this.store.remove(lobby);
    }
  };

  /**
   * Validates properties of a class instance.
   * @private
   */
  validate() {
    if (!isIStore(this.store)) {
      throw new TypeError('store must match IStore interface');
    }
  }
}

module.exports = OnLeaveListener;
