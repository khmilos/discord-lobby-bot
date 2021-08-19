// @ts-check

/**
 * Checks if variable matches ITemplate interface.
 * @param {any} x
 */
function isTemplate(x) {
  return typeof x.generate === 'function';
}

/**
 * Checks if variable matches LobbyTemplates interface.
 * @param {any} x
 */
function isTemplateByLobbyKey(x) {
  return (
    x.channel &&
    typeof x.channel === 'object' &&
    isTemplate(x.channel.title) &&
    (!x.channel.titleFull || isTemplate(x.channel.titleFull)) &&
    x.message &&
    typeof x.message === 'object' &&
    isTemplate(x.message.title) &&
    (!x.message.titleFull || isTemplate(x.message.titleFull)) &&
    (!x.message.member || isTemplate(x.message.member)) &&
    (!x.message.link || isTemplate(x.message.link)) &&
    (!x.message.linkFull || isTemplate(x.message.linkFull))
  );
}

/**
 * Checks if variable matches IStore interface.
 * @param {any} x
 */
function isIStore(x) {
  return (
    typeof x === 'object' &&
    typeof x.reserveIndex === 'function' &&
    typeof x.save === 'function' &&
    typeof x.find === 'function' &&
    typeof x.remove === 'function'
  );
}

/**
 * Checks if variable matches ILobbyFactory interface.
 * @param {any} x
 */
function isILobbyFactory(x) {
  return typeof x.create === 'function';
}

/**
 * Checks if variable matches LobbyFactoryByChannelId interface.
 * @param {any} x
 */
function isLobbyFactoryByChannelId(x) {
  return (
    x &&
    typeof x === 'object' &&
    Object.values(x).every((factory) => isILobbyFactory(factory))
  );
}

/**
 * Checks if variable matches IListener interface.
 * @param {any} x
 */
function isIListener(x) {
  return x && typeof x === 'object' && typeof x.listen === 'function';
}

/**
 * Checks if variable matches LobbySettings.
 * @param {any} x
 */
function isLobbySettings(x) {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.limit === 'number' &&
    typeof x.join === 'string' &&
    (!x.category || typeof x.category === 'string') &&
    (!x.text || typeof x.text === 'string') &&
    x.channel &&
    typeof x.channel === 'object' &&
    typeof x.channel.title === 'string' &&
    (!x.channel.titleFull || typeof x.channel.titleFull === 'string') &&
    x.message &&
    typeof x.message === 'object' &&
    typeof x.message.title === 'string' &&
    (!x.message.titleFull || typeof x.message.titleFull === 'string') &&
    (!x.message.member || typeof x.message.member === 'string') &&
    (!x.message.link || typeof x.message.link === 'string') &&
    (!x.message.linkFull || typeof x.message.linkFull === 'string')
  );
}
/**
 * Checks if variable matches Settings.
 * @param {any} x
 */
function isSettings(x) {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.token === 'string' &&
    (!x.category || typeof x.category === 'string') &&
    (!x.text || typeof x.text === 'string') &&
    !x.lobbies.some((lobby) => !isLobbySettings(lobby))
  );
}

module.exports = {
  isTemplate,
  isTemplateByLobbyKey,
  isIStore,
  isILobbyFactory,
  isLobbyFactoryByChannelId,
  isIListener,
  isLobbySettings,
  isSettings,
};
