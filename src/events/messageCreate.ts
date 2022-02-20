import { Message } from "discord.js";
import DiscordClient from "../client/client";
import { EventType } from "../utils/types";

export default {
  name: "messageCreate",
  async execute(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    const userId = message.author.id;
    const addXp = Math.floor(Math.random() * 9) + 1;
    const hasLeveledUp = await client.levelSystem.appendXp(userId, addXp);
    if (hasLeveledUp) {
      const user = (await client.levelSystem.fetch(userId))!;
      const addMoney = user.level * 1000;
      await client.economySystem.setMoney(userId, user.money + addMoney);
      message.reply(
        `${message.author.toString()}님이 ${
          user.level
        }레벨이 되었습니다.\n돈이 ${addMoney}만큼 지급되었습니다.`
      );
    }
  },
} as EventType;
