import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("뮤트")
    .setDescription("사용자를 뮤트합니다.")
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("타임아웃을 적용시킬 유저를 선택해 주세요.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("시간")
        .setDescription("뮤트할 시간을 설정해 주세요.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("사유")
        .setDescription("타임아웃을 적용시킬 사유를 입력해 주세요.")
        .setRequired(false)
    ),
  permissions: ["MODERATE_MEMBERS"],
  async execute(
    client: DiscordClient,
    interaction: CommandInteraction,
    embed: MessageEmbed
  ) {
    try {
      const member = interaction.options.getMember(
        "유저"
      ) as GuildMember | null;
      const time = interaction.options.getNumber("시간");
      const reason = interaction.options.getString("사유") || "사유 없음";
      if (member) {
        await member.timeout(time! * 1000, reason);
        await interaction.reply({
          embeds: [
            embed.setDescription(`${member.user.tag}님을 뮤트했습니다.`),
          ],
        });
      } else {
        interaction.reply("유저를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.log(err);
    }
  },
} as CommandType;
