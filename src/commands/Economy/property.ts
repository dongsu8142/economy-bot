import { SlashCommandBuilder } from "@discordjs/builders";
import { CryptoCode } from "../../utils/enums";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("자산")
    .setDescription("자산을 확인합니다."),
  async execute(client, interaction, embed) {
    try {
      const { user } = interaction;
      const userEconomy = await client.userRepository.findOne({
        userId: user.id,
      });
      if (userEconomy) {
        const newEmbed = embed
          .setTitle(`${user.username}님의 자산`)
          .setDescription(`현재 돈은 ${userEconomy.money}입니다.`);
        Object.keys(CryptoCode).map((coin) => {
          newEmbed.addField(coin, `${userEconomy[coin]}개`, true);
        });
        await interaction.reply({
          embeds: [newEmbed],
        });
      } else {
        await interaction.reply({
          embeds: [
            embed
              .setDescription(
                "가입을 하지 않았습니다. 가입을 하시려면 /가입을 입력하세요."
              )
              .setColor("RED"),
          ],
        });
      }
    } catch (err) {
      console.log(err);
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
