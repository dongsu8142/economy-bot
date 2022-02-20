import { SlashCommandBuilder } from "@discordjs/builders";
import DiscordClient from "../../client/client";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("순위")
    .setDescription("1위부터 10위까지의 순위를 보여줍니다.")
    .addStringOption((optioen) =>
      optioen
        .setName("종류")
        .setDescription("보고싶은 순위를 선택해주세요")
        .setRequired(true)
        .addChoice("레벨", "level")
        .addChoice("돈", "money")
    ),
  async execute(client, interaction, embed) {
    const kind = interaction.options.getString("종류", true);
    if (kind === "money") {
      const leaderboard = await client.economySystem.fetchLeaderboard(10);
      const description = (
        await Promise.all(
          leaderboard.map(async (user, index) => {
            return `${index + 1}. ${await getUserName(client, user.userId)} - ${
              user.money
            }`;
          })
        )
      ).join("\n");
      interaction.reply({
        embeds: [embed.setTitle("순위").setDescription(description)],
      });
    } else {
      const leaderboard = await client.levelSystem.fetchLeaderboard(10);
      const description = (
        await Promise.all(
          leaderboard.map(async (user, index) => {
            return `${index + 1}. ${await getUserName(client, user.userId)} - ${
              user.xp
            }`;
          })
        )
      ).join("\n");
      interaction.reply({
        embeds: [embed.setTitle("순위").setDescription(description)],
      });
    }
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
