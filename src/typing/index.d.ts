import { GuildMember, VoiceState, VoiceChannel, GuildMember } from 'discord.js';

export interface LobbySettings {
  creatorId: string;
  name: string;
  limit: number;
}

export interface InitSettings {
  categoryId: srting;
  channelId: string;
  lobbies: LobbySettings[];
}

export interface BaseLobby {
  readonly channel: VoiceChannel;
  readonly index: number;
  add(member: GuildMember): Promise<void>;
  remove(member: GuildMember): Promise<void>;
  delete(): Promise<void>;
  isExists(member: GuildMember): boolean;
}

export interface BaseVoiceChannelFactory {
  create(index: number): Promise<VoiceChannel>;
}

export interface BaseLobbyFactory {
  create(member: GuildMember, index: number): Promise<BaseLobby>;
}

export interface BaseLobbyStore {
  reserveIndex(): number;
  save(lobby: BaseLobby): void;
  find(channelId: string): BaseLobby | null;
  remove(lobby: BaseLobby): void;
}

export interface FactoryByCreatorId {
  [creatorId: string]: BaseLobbyFactory;
}

export interface BaseOnCreateListener {
  listen(
    oldState: VoiceState,
    newState: VoiceState,
    creator: VoiceChannel,
  ): void;
}

export interface BaseOnJoinListener {
  listen(oldState: VoiceState, newState: VoiceState, lobby: BaseLobby): void;
}

export interface BaseOnLeaveListener {
  listen(oldState: VoiceState, newState: VoiceState, lobby: BaseLobby): void;
}

export interface ListenersByEvent {
  create?: BaseOnCreateListener[];
  join?: BaseOnJoinListener[];
  leave?: BaseOnLeaveListener[];
}

/**
 * Manages listeners to `voiceStateUpdate` event according to lobby functional
 * requirements.
 */
export interface BaseListenerManager {
  /**
   * Starts listening to the `voiceStateUpdate` event.
   */
  start(): void;

  /**
   * Stops listening to the `voiceStateUpdate` event.
   */
  stop(): void;
}
