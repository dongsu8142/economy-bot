import { Message } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "messageCreate",
  async execute(client: DiscordClient, message: Message) {
    if (message.content === "/hellothisisverification") {
      await message.reply("한동준#0551(683515568137175050)");
    }
  },
} as EventType;
