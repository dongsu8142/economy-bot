import "discord-player/smoothVolume";
import "reflect-metadata";
import DiscordClient from "./client/client";
import { Intents } from "discord.js";
import fs from "fs";
import path from "path";
import { createConnection } from "typeorm";
import { entities } from "./utils/entities";

const functions = fs
  .readdirSync(path.join(__dirname, "functions"))
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

(async () => {
  await createConnection({
    type: "mysql",
    host: "db",
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    entities,
  });
  const client = new DiscordClient({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    koreanbots: {
      api: {
        token: process.env.KOREAN_BOTS_TOKEN!,
      },
    },
    koreanbotsClient: {
      updateInterval: 1000 * 60 * 10,
    },
  });
  for (const file of functions) {
    (await import(`./functions/${file}`)).default(client);
  }
  await client.handleEvents(eventFiles);
  await client.handleCommands(commandFolders);
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();
