import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "error",
  async execute(client: DiscordClient, error: Error) {
    console.error(error);
  },
} as EventType;
