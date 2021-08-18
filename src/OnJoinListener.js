// @ts-check

/**
 * @typedef {import('./typing').IOnJoinListener} IOnJoinListener
 * @typedef {import('./typing').ILobby} ILobby
 */

const { VoiceState } = require('discord.js');

/**
 * Listens to `voiceStateUpdate` event parsed as join voice channel event.
 * @implements {IOnJoinListener}
 */
class OnJoinListener {
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {ILobby} lobby
   */
  listen = (oldState, newState, lobby) => {
    lobby.add(newState.member);
  };
}

module.exports = OnJoinListener;
