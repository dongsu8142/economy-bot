import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordClient from "../../client/client";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("순위")
    .setDescription("1위부터 10위까지의 순위를 보여줍니다."),
  async execute(client, interaction, embed) {
    const users = (await client.economyRepository.find())
      .sort((a, b) => b.money - a.money)
      .slice(0, 10);
    const description = (
      await Promise.all(
        users.map((user, index) => {
          return `${index + 1}. ${getUserName(client, user.userId)} - ${
            user.money
          }`;
        })
      )
    ).join("\n");
    interaction.reply({
      embeds: [embed.setTitle("순위").setDescription(description)],
    });
  },
} as CommandType;

const getUserName = async (client: DiscordClient, userId: string) => {
  const user = await client.users.cache.get(userId);
  if (user) {
    return user.username;
  } else {
    return "null";
  }
};
