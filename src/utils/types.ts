import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayerEvents } from "discord-player";
import {
  ClientEvents,
  CommandInteraction,
  MessageEmbed,
  PermissionResolvable,
} from "discord.js";
import DiscordClient from "../client/client";
import { CryptoCode } from "./enums";

export type CommandType = {
  data: SlashCommandBuilder;
  permissions: PermissionResolvable[] | null;
  execute(
    client: DiscordClient,
    interaction: CommandInteraction,
    embed: MessageEmbed
  ): Promise<void>;
};

export type EventType = {
  name: keyof PlayerEvents | keyof ClientEvents;
  once: boolean | null;
  player: boolean | null;
  execute(client: DiscordClient, ...args: any[]): Promise<void>;
};

export type CryptoType = {
  type: CryptoCode;
  code: string;
  trade_price: number;
  trade_volume: number;
  ask_bid: string;
  prev_closing_price: number;
  change: string;
  change_price: number;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  timestamp: number;
  sequential_id: number;
  stream_type: string;
};
