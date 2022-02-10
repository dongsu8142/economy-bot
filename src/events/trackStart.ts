import { Queue, Track } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "trackStart",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>,
    track: Track
  ) {
    queue.metadata?.channel.send(`${track.title}을 재생합니다.`);
  },
} as EventType;
