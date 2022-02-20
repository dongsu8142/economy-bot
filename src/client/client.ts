import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import { Player } from "discord-player";
import { Collection } from "discord.js";
import { KoreanbotsClient } from "koreanbots";
import { KoreanbotsClientOptions } from "koreanbots/dist/src/utils/types";
import { getRepository, Repository } from "typeorm";
import CryptoWS from "../utils/cryptoWS";
import { User } from "../utils/entities/user";
import { CommandType } from "../utils/types";
export default class DiscordClient extends KoreanbotsClient {
  private _commands = new Collection<string, CommandType>();
  private _handleEvents = async (eventFiles: string[]) => {};
  private _handleCommands = async (commandFolers: string[]) => {};
  private _commandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
  private _player: Player = new Player(this, {
    ytdlOptions: { filter: "audioonly", quality: "highestaudio" },
  });
  private _userRepository: Repository<User> = getRepository(User);
  private _crypto: CryptoWS = new CryptoWS();

  constructor(options: KoreanbotsClientOptions) {
    super(options);
  }

  get commands() {
    return this._commands;
  }
  get handleEvents() {
    return this._handleEvents;
  }
  get handleCommands() {
    return this._handleCommands;
  }
  get commandArray() {
    return this._commandArray;
  }
  get userRepository() {
    return this._userRepository;
  }
  get player() {
    return this._player;
  }
  get crypto() {
    return this._crypto;
  }

  set handleEvents(value) {
    this._handleEvents = value;
  }
  set handleCommands(value) {
    this._handleCommands = value;
  }
}
