// @ts-check

/**
 * @typedef {import('./typing').IStore} IStore
 * @typedef {import('./typing').ILobby} ILobby
 */

/**
 * Manages access to active lobbies.
 * @implements {IStore}
 */
class Store {
  /**
   * Map of voice channel id / Lobby pairs.
   * @type {{[channelId: string]: ILobby}}
   * @private
   */
  store;

  /**
   * Indices of active lobbies.
   * @type {Set<number | string>}
   * @private
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
   * @param {ILobby} lobby
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
   * @param {ILobby} lobby
   */
  remove(lobby) {
    this.indices.delete(lobby.index);
    delete this.store[lobby.channel.id];
  }
}

module.exports = Store;
