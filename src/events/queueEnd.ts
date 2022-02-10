import { Queue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "queueEnd",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>
  ) {
    queue.metadata?.channel.send("재생목록을 모두 재생하였습니다.");
  },
} as EventType;
