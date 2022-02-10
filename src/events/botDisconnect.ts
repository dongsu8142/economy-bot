import { Queue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "botDisconnect",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>
  ) {
    queue.metadata?.channel.send(
      "봇이 음성 채널과 연결이 끊어져 재생을 중지합니다."
    );
  },
} as EventType;
