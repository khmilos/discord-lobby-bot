import { VoiceChannel, GuildMember, VoiceState } from 'discord.js';
import { TemplateArguments } from './data-structures';

/**
 * Generates string from template.
 */
export interface ITemplate<T extends TemplateArguments> {
  /**
   * Generates string.
   */
  generate(args: T): string;
}

/**
 * Creates template-class wrapper for template-function from template-string.
 */
export interface ITemplateFactory {
  /**
   * Creates template-class instance.
   */
  create<T extends TemplateArguments>(template: string): ITemplate<T>;
}

/**
 * Manages voice channel and message.
 */
export interface ILobby {
  /**
   * Related voice channel.
   */
  readonly channel: VoiceChannel;

  /**
   * Unique among active lobbies.
   */
  readonly index: number | string;

  /**
   * Adds member to lobby.
   */
  add(member: GuildMember): Promise<void>;

  /**
   * Removes member from lobby.
   */
  remove(member: GuildMember): Promise<void>;

  /**
   * Deletes voice channel and message.
   */
  delete(): Promise<void>;

  /**
   * Checks if member exists inside lobby.
   */
  isExists(member: GuildMember): boolean;
}

/**
 * Creates lobby.
 */
export interface ILobbyFactory {
  /**
   * Creates lobby.
   */
  create(member: GuildMember, index: number | string): Promise<ILobby>;
}

/**
 * Manages access to active lobbies.
 */
export interface IStore {
  /**
   * Reserves free index in store.
   */
  reserveIndex(): number | string | Promise<number> | Promise<string>;

  /**
   * Saves lobby to the store.
   */
  save(lobby: ILobby): void | Promise<void>;

  /**
   * Finds Lobby instance by voice channel id.
   * @param channelId
   */
  find(channelId: string): ILobby | Promise<ILobby>;

  /**
   * Removes lobby from the store.
   * @param lobby
   */
  remove(lobby: ILobby): void | Promise<void>;
}

/**
 * Listens to `voiceStateUpdate` event.
 */
export interface IListener {
  /**
   * Listen callback function.
   */
  listen(oldState: VoiceState, newState: VoiceState, ...args: any): any;
}

/**
 * Listens to `voiceStateUpdate` event parsed as create voice channel event.
 */
export interface IOnCreateListener extends IListener {
  /**
   * Listen callback function.
   */
  listen(
    oldState: VoiceState,
    newState: VoiceState,
    creator: VoiceChannel,
  ): any;
}

/**
 * Listens to `voiceStateUpdate` event parsed as join voice channel event.
 */
export interface IOnJoinListener {
  /**
   * Listen callback function.
   */
  listen(oldState: VoiceState, newState: VoiceState, lobby: ILobby): any;
}

/**
 * Listens to `voiceStateUpdate` event parsed as leave voice channel event.
 */
export interface IOnLeaveListener {
  /**
   * Listen callback function.
   */
  listen(oldState: VoiceState, newState: VoiceState, lobby: ILobby): any;
}

/**
 * Manages listeners to `voiceStateUpdate` event.
 */
export interface IListenerManager {
  /**
   * Starts listening to the `voiceStateUpdate` event.
   */
  start(): void;

  /**
   * Stops listening to the `voiceStateUpdate` event.
   */
  stop(): void;
}
