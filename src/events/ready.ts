import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "ready",
  once: true,
  async execute(client: DiscordClient) {
    console.log("Ready!");
    await client.application?.commands.set(client.commandArray);
  },
} as EventType;
