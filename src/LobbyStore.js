// @ts-check
/**
 * @typedef {import('./typing').BaseLobbyStore} BaseLobbyStore
 * @typedef {import('./typing').BaseLobby} BaseLobby
 */

/**
 * @implements {BaseLobbyStore}
 */
class LobbyStore {
  /**
   * @private
   * @type {{[channelId: string]: BaseLobby}}
   */
  store;

  /**
   * @private
   * @type {Set<number>}
   */
  indices;

  constructor() {
    this.store = {};
    this.indices = new Set();
  }

  reserveIndex() {
    let index = 1;
    while (this.indices.has(index)) index++;
    this.indices.add(index);
    return index;
  }

  /**
   * @param {BaseLobby} lobby
   */
  save(lobby) {
    this.store[lobby.channel.id] = lobby;
  }

  /**
   * @param {string} channelId
   */
  find(channelId) {
    return this.store[channelId];
  }

  /**
   * @param {BaseLobby} lobby
   */
  remove(lobby) {
    this.indices.delete(lobby.index);
    delete this.store[lobby.channel.id];
  }
}

module.exports = LobbyStore;
