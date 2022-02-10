import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("추방")
    .setDescription("사용자를 서버에서 추방합니다.")
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("추방할 유저를 지정합니다.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("사유")
        .setDescription("추방의 사유를 지정합니다.")
        .setRequired(false)
    ),
  permissions: ["KICK_MEMBERS"],
  async execute(client, interaction, embed) {
    try {
      const member = interaction.options.getMember(
        "유저"
      ) as GuildMember | null;
      const reason = interaction.options.getString("사유") || "사유 없음";
      if (member) {
        await member.kick(reason);
        await interaction.reply({
          embeds: [
            embed.setDescription(`${member.user.tag}님을 추방했습니다.`),
          ],
        });
      } else {
        await interaction.reply("유저를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.log(err);
    }
  },
} as CommandType;
