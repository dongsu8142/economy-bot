import { PlayerEvents } from "discord-player";
import { ClientEvents } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default (client: DiscordClient) => {
  client.handleEvents = async (eventFiles) => {
    for (const file of eventFiles) {
      const event = (await import(`../events/${file}`)).default as EventType;
      if (event.player) {
        if (event.once) {
          client.player.once(
            event.name as keyof PlayerEvents,
            (...args: any[]) => event.execute(client, ...args)
          );
        } else {
          client.player.on(event.name as keyof PlayerEvents, (...args: any[]) =>
            event.execute(client, ...args)
          );
        }
      } else {
        if (event.once) {
          client.once(event.name as keyof ClientEvents, (...args) =>
            event.execute(client, ...args)
          );
        } else {
          client.on(event.name as keyof ClientEvents, (...args) =>
            event.execute(client, ...args)
          );
        }
      }
    }
  };
};
