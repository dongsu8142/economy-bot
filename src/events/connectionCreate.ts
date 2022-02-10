import { Queue, StreamDispatcher } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "connectionCreate",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>,
    connection: StreamDispatcher
  ) {
    queue.metadata?.channel.send("음성 채널에 연결되었습니다.");
  },
} as EventType;
