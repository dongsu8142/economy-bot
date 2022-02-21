import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("탈퇴")
    .setDescription(
      "탈퇴합니다. 중간에 확인 문자가 없습니다. 레벨도 초기화 됩니다."
    ),
  async execute(client, interaction, embed) {
    const user = await client.economySystem.fetch(interaction.user.id);
    if (!user) {
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              "가입을 하지 않았습니다. 가입을 하시려면 /가입을 입력하세요."
            )
            .setColor("RED"),
        ],
      });
    }
    const result = await client.economySystem.delete(user);
    if (result.affected) {
      await interaction.reply({
        embeds: [embed.setDescription("성공적으로 탈퇴했습니다.")],
      });
    }
  },
} as CommandType;
