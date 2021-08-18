import {
  GuildChannelManager,
  TextChannel,
  CategoryChannel,
  MessageEmbed,
  Message,
  VoiceChannel,
  Invite,
  Client,
} from 'discord.js';
import {
  ITemplate,
  ILobbyFactory,
  IOnCreateListener,
  IOnJoinListener,
  IOnLeaveListener,
  IStore,
} from './interfaces';

/**
 * Settings for creating lobby.
 */
export interface LobbySettings {
  limit: number;
  join: string;
  category?: string;
  text?: string;
  channel: {
    title: string;
    titleFull?: string;
  };
  message: {
    title: string;
    titleFull?: string;
    member?: string;
    link?: string;
    linkFull?: string;
  };
}

/**
 * Settings for starting an app.
 */
export interface Settings {
  token: string;
  category?: string;
  text?: string;
  lobbies: LobbySettings[];
}

/**
 * Arguments for generating title.
 */
export interface TitleTemplateArguments {
  /**
   * Unique lobby index among other active lobbies.
   */
  index: string | number;

  /**
   * Members limit in lobby.
   */
  limit: string | number;

  /**
   * Number of members inside lobby.
   */
  current: string | number;

  /**
   * Number of members left to full inside lobby.
   */
  left: string | number;
}

/**
 * Arguments for generating lobby member description string.
 */
export interface MemberTemplateArguments {
  /**
   * Member's tag.
   */
  tag: string;

  /**
   * Member's index inside lobby.
   */
  index: string | number;
}

/**
 * Arguments for generating link to join voice channel.
 */
export interface LinkTemplateArguments {
  /**
   * Link to join voice channel.
   */
  link: string;
}

/**
 * Alias for possible generic type in ITemplate interface.
 */
export type TemplateArguments =
  | TitleTemplateArguments
  | MemberTemplateArguments
  | LinkTemplateArguments;

/**
 * Generates string for templates.
 */
export interface TemplateFunction<T extends TemplateArguments> {
  (args: T): string;
}

/**
 * Map of templates by key inside lobby.
 */
export interface TemplateByLobbyKey {
  channel: {
    title: ITemplate<TitleTemplateArguments>;
    titleFull?: ITemplate<TitleTemplateArguments>;
  };
  message: {
    title: ITemplate<TitleTemplateArguments>;
    titleFull?: ITemplate<TitleTemplateArguments>;
    member?: ITemplate<MemberTemplateArguments>;
    link?: ITemplate<LinkTemplateArguments>;
    linkFull?: ITemplate<LinkTemplateArguments>;
  };
}

/**
 * Arguments for creating a Lobby instance.
 */
export interface LobbyArguments {
  channel: VoiceChannel;
  invite: Invite;
  message: Message;
  embed: MessageEmbed;
  index: number | string;
  templates: TemplateByLobbyKey;
}

/**
 * Arguments for creating a LobbyFactory instance.
 */
export interface LobbyFactoryArguments {
  manager: GuildChannelManager;
  text: TextChannel;
  category: CategoryChannel;
  limit: number;
  templates: TemplateByLobbyKey;
}

/**
 * Map of channel id and lobby factory instance pairs.
 */
export interface LobbyFactoryByChannelId {
  [channelId: string]: ILobbyFactory;
}

/**
 * Map of keys custom event (`create`, `join`, `leave`) and values as listeners.
 */
export interface ListenersByCustomEvent {
  create?: IOnCreateListener[];
  join?: IOnJoinListener[];
  leave?: IOnLeaveListener[];
}

/**
 * Arguments for creating ListenerManager instance.
 */
export interface ListenerManagerArguments {
  client: Client;
  store: IStore;
  creators: VoiceChannel[];
  listenersByEvent: ListenersByCustomEvent;
}
