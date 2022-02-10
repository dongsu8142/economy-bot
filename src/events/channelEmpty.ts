import { Queue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "channelEmpty",
  player: true,
  async execute(
    client: DiscordClient,
    queue: Queue<{ channel: TextBasedChannel }>
  ) {
    queue.metadata?.channel.send(
      "음성 채널이 비어있습니다. 음악 재생을 중지합니다."
    );
  },
} as EventType;
