import { Queue, Track } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "trackAdd",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>,
    track: Track
  ) {
    queue.metadata?.channel.send(`${track.title} 음악이 추가되었습니다.`);
  },
} as EventType;
