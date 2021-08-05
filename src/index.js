// @ts-check
/**
 * @typedef {import('./typing').InitSettings} InitSettings
 */

const {
  Client,
  CategoryChannel,
  TextChannel,
  VoiceChannel,
} = require('discord.js');
const LobbyStore = require('./LobbyStore');
const VoiceChannelFactory = require('./VoiceChannelFactory');
const LobbyFactory = require('./LobbyFactory');
const OnCreateListener = require('./OnCreateListener');
const OnJoinListener = require('./OnJoinListener');
const OnLeaveListener = require('./OnLeaveListener');
const ListenerManager = require('./ListenerManager');

/**
 * @param {Client} client
 * @param {InitSettings } settings
 */
function init(client, settings) {
  validateInitSettings(settings);

  client.once('ready', async () => {
    const [textChannel, category, ...creators] = await Promise.all([
      client.channels.fetch(settings.channelId),
      client.channels.fetch(settings.categoryId),
      ...settings.lobbies.map(lobby => client.channels.fetch(lobby.creatorId)),
    ]);
    if (
      !(category instanceof CategoryChannel) ||
      !(textChannel instanceof TextChannel) ||
      creators.some(creator => !(creator instanceof VoiceChannel))
    ) {
      throw new Error('Category channel or one of the creator are not fetched');
    }

    const manager = textChannel.guild.channels;

    const store = new LobbyStore();

    const factories = settings.lobbies.map(lobby => {
      return new LobbyFactory(
        textChannel,
        new VoiceChannelFactory(
          manager,
          category,
          index => `${lobby.name} #${index}`,
          lobby.limit,
        ),
        lobby.name,
      );
    });

    const factoryByCreatorId = creators.reduce((acc, creator, index) => {
      return { ...acc, [creator.id]: factories[index] };
    }, {});

    const listenerByEvent = {
      create: [new OnCreateListener(store, factoryByCreatorId)],
      join: [new OnJoinListener()],
      leave: [new OnLeaveListener(store)],
    };

    const listenerManager = new ListenerManager(
      client,
      store,
      // @ts-ignore
      creators,
      listenerByEvent,
    );
    listenerManager.start();
    console.log('Bot is ready');
  });
}

function validateInitSettings(settings) {
  const errors = [
    typeof settings.categoryId !== 'string' &&
      'categoryId must be specified as srting',
    typeof settings.channelId !== 'string' &&
      'channelId must be specified as string',
    (!Array.isArray(settings.lobbies) ||
      settings.lobbies.some(lobby => typeof lobby.creatorId !== 'string')) &&
      'lobbies must be array, where each element must have specified creatorId as string',
  ].filter(error => error);
  if (errors.length > 0) {
    throw new TypeError(errors.join('\n\t'));
  }
}

module.exports = init;
