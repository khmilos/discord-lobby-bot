// @ts-check

/**
 * @typedef {import('./typing').Settings} Settings
 * @typedef {import('./ListenerManager').IListenerManager} IListenerManager
 */

const {
  Channel,
  Client,
  VoiceChannel,
  CategoryChannel,
  TextChannel,
} = require('discord.js');
const TemplateFactory = require('./TemplateFactory');
const LobbyFactory = require('./LobbyFactory');
const Store = require('./Store');
const ListenerManager = require('./ListenerManager');
const OnCreateListener = require('./OnCreateListener');
const OnJoinListener = require('./OnJoinListener');
const OnLeaveListener = require('./OnLeaveListener');
const { isSettings } = require('./typing/utils');

/**
 * Main app class.
 */
class App {
  /**
   * @private
   * @type {Client}
   */
  client;

  /**
   * @private
   * @type {IListenerManager}
   */
  listenerManager;

  /**
   * @param {Settings} settings
   */
  constructor(settings) {
    this.settings = settings;
    this.validate();
  }

  /**
   * Starts an application.
   */
  main() {
    this.client = new Client();
    this.client.once('ready', this.init());
    this.client.login(this.settings.token);
  }

  /**
   * Listener to once ready client event.
   * @private
   */
  init() {
    const t = this;
    return async () => {
      const lobbiesChannels = await t.fetchChannels();
      const lobbiesTemplates = t.createTemplates();
      const factories = lobbiesChannels.map((lobbyChannels, index) => {
        return new LobbyFactory({
          manager: lobbyChannels.join.guild.channels,
          text: lobbyChannels.text,
          category: lobbyChannels.category,
          limit: t.settings.lobbies[index].limit,
          templates: lobbiesTemplates[index],
        });
      });
      const store = new Store();
      const creators = lobbiesChannels.map(lobbyChannels => lobbyChannels.join);
      const factoryByChannelId = Object.fromEntries(
        creators.map((creator, index) => [creator.id, factories[index]]),
      );
      t.listenerManager = new ListenerManager({
        client: t.client,
        store,
        creators,
        listenersByEvent: {
          create: [new OnCreateListener(store, factoryByChannelId)],
          join: [new OnJoinListener()],
          leave: [new OnLeaveListener(store)],
        },
      });
      t.listenerManager.start();
      console.log('Bot is ready');
    };
  }

  /**
   * Fetches lobbies channels.
   * @private
   * @return {Promise<{
   *  join: VoiceChannel;
   *  category: CategoryChannel;
   *  text: TextChannel;
   * }[]>}
   */
  async fetchChannels() {
    const [category, text, lobbyTuples] = await Promise.all([
      this.settings.category &&
        this.client.channels.fetch(this.settings.category),
      this.settings.text && this.client.channels.fetch(this.settings.text),
      Promise.all(
        this.settings.lobbies.map(lobby => {
          return Promise.all([
            this.client.channels.fetch(lobby.join),
            lobby.category && this.client.channels.fetch(lobby.category),
            lobby.text && this.client.channels.fetch(lobby.text),
          ]);
        }),
      ),
    ]);
    const lobbyMaps = lobbyTuples.map(lobbyTuple => ({
      join: lobbyTuple[0],
      category: lobbyTuple[1] || category,
      text: lobbyTuple[2] || text,
    }));
    this.validateLobbyMaps(lobbyMaps);
    /** @ts-ignore */
    return lobbyMaps;
  }

  /**
   * Creates template-classes from template-strings.
   * @private
   */
  createTemplates() {
    const factory = new TemplateFactory();
    return this.settings.lobbies.map(lobby => ({
      channel: {
        title: factory.create(lobby.channel.title),
        ...(lobby.channel.titleFull && {
          titleFull: factory.create(lobby.channel.titleFull),
        }),
      },
      message: {
        title: factory.create(lobby.message.title),
        ...(lobby.message.titleFull && {
          titleFull: factory.create(lobby.message.titleFull),
        }),
        member: factory.create(lobby.message.member ?? '[{index}] - {tag}\n'),
        link: factory.create(lobby.message.link ?? 'Join - {link}'),
        ...(lobby.message.linkFull && {
          linkFull: factory.create(lobby.message.linkFull),
        }),
      },
    }));
  }

  /**
   * Validates settings.
   * @private
   * @throws {TypeError} When `settings` isn't valid.
   */
  validate() {
    if (!isSettings(this.settings)) {
      throw new TypeError('settings must match Settings');
    }
    if (this.settings.lobbies.length === 0) {
      throw new TypeError('must be specified any lobby');
    }
    if (
      this.settings.lobbies.some(lobby => {
        return !lobby.category && !this.settings.category;
      })
    ) {
      throw new TypeError(
        'must be specified category channel in lobby or default one.',
      );
    }
    if (
      this.settings.lobbies.some(lobby => {
        return !lobby.text && !this.settings.text;
      })
    ) {
      throw new TypeError(
        'must be specified text channel in lobby or default one.',
      );
    }
  }

  /**
   * Validates fetched lobby channels according to needed type.
   * @param {{
   *  join: Channel;
   *  category: Channel;
   *  text: Channel;
   * }[]} lobbyMaps
   * @throws {TypeError} When one of the channels isn't valid type.
   */
  validateLobbyMaps(lobbyMaps) {
    const errors = lobbyMaps
      .map((lobbyMap, index) => [
        !(lobbyMap.join instanceof VoiceChannel) &&
          `join at lobby #${index + 1} must be voice channel`,
        !(lobbyMap.category instanceof CategoryChannel) &&
          (this.settings.lobbies[index].category
            ? `category at lobby #${index + 1} must be category channel`
            : 'default category channel must be category channel'),
        !(lobbyMap.text instanceof TextChannel) &&
          (this.settings.lobbies[index].text
            ? `text at lobby #${index + 1} must be text channel`
            : 'default text channel must be text channel'),
      ])
      .flat()
      .filter(error => error);
    if (errors.length > 0) {
      throw new TypeError(errors.join('\n\t'));
    }
  }
}

module.exports = App;
