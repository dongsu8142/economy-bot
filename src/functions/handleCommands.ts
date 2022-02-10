import DiscordClient from "../client/client";
import fs from "fs";
import path from "path";
import { CommandType } from "../utils/types";

export default (client: DiscordClient) => {
  client.handleCommands = async (commandFolers) => {
    for (const folder of commandFolers) {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, "../commands", folder))
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = (
          await import(path.join(__dirname, "../commands", folder, file))
        ).default as CommandType;
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }
  };
};
