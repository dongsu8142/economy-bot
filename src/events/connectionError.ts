import { Queue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "connectionError",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>,
    error: Error
  ) {
    queue.metadata?.channel.send(`음성 채널에 연결 중 오류가 발생했습니다.`);
  },
} as EventType;
