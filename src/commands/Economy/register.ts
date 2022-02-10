import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("가입")
    .setDescription("이코노미 시스템에 가입합니다."),
  async execute(client, interaction, embed) {
    try {
      const { user } = interaction;
      const userEconomy = await client.economyRepository.findOne({
        userId: user.id,
      });
      if (userEconomy) {
        await interaction.reply({
          embeds: [
            embed
              .setDescription(`${user.tag}님은 이미 가입되어 있습니다.`)
              .setColor("RED"),
          ],
        });
      } else {
        const newMoney = await client.economyRepository.create({
          userId: user.id,
        });
        await client.economyRepository.save(newMoney);
        await interaction.reply({
          embeds: [embed.setDescription("가입이 완료되었습니다.")],
        });
      }
    } catch (err) {
      await interaction.reply({
        embeds: [
          embed
            .setDescription(
              "정보를 가져오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            )
            .setColor("RED"),
        ],
      });
    }
  },
} as CommandType;
