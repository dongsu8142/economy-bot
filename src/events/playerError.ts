import { Queue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "error",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>,
    error: Error
  ) {
    console.log(
      `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
    );
    queue.metadata?.channel.send("음악 재생 중 오류가 발생했습니다.");
  },
} as EventType;
