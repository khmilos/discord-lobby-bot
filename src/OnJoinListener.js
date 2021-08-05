// @ts-check
/**
 * @typedef {import('./typing').BaseOnJoinListener} BaseOnJoinListener
 * @typedef {import('./typing').BaseLobby} BaseLobby
 */
const { VoiceState } = require('discord.js');

/**
 * @implements {BaseOnJoinListener}
 */
class OnJoinListener {
  constructor() {}

  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {BaseLobby} lobby
   */
  listen = (oldState, newState, lobby) => {
    lobby.add(newState.member);
  };
}

module.exports = OnJoinListener;
