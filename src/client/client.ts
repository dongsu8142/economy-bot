import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import { Player } from "discord-player";
import { Collection } from "discord.js";
import { KoreanbotsClient, KoreanbotsClientOptions } from "koreanbots";
import { getRepository, Repository } from "typeorm";
import CryptoWS from "../utils/cryptoWS";
import { Economy } from "../utils/entities/economy";
import { CommandType } from "../utils/types";

export default class DiscordClient extends KoreanbotsClient {
  private _commands = new Collection<string, CommandType>();
  private _handleEvents = async (eventFiles: string[]) => {};
  private _handleCommands = async (commandFolers: string[]) => {};
  private _commandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
  private _player: Player = new Player(this, {
    ytdlOptions: { filter: "audioonly", quality: "highestaudio" },
  });
  private _economyRepository: Repository<Economy> = getRepository(Economy);
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
  get economyRepository() {
    return this._economyRepository;
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
