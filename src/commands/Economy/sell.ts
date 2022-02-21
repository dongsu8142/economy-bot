import { SlashCommandBuilder } from "@discordjs/builders";
import { CryptoCode } from "../../utils/enums";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("판매")
    .setDescription("주식 또는 암호화폐을 판매합니다.")
    .addStringOption((option) => {
      Object.keys(CryptoCode).map((coin) => {
        option.addChoice(coin, coin);
      });
      return option
        .setName("종류")
        .setRequired(true)
        .setDescription("판매하고 싶은 종류를 선택하세요.");
    })
    .addNumberOption((option) =>
      option
        .setName("개수")
        .setMinValue(1)
        .setRequired(true)
        .setDescription("판매하고 싶은 개수를 입력하세요.")
    ),
  async execute(client, interaction, embed) {
    try {
      const user = await client.economySystem.fetch(interaction.user.id);
      if (user) {
        const kind = interaction.options.getString("종류", true);
        const count = interaction.options.getNumber("개수", true);
        const sell = await client.economySystem.sell(user, kind, count);
        if (sell) {
          await interaction.reply({
            embeds: [
              embed
                .setTitle("구매 완료")
                .setDescription(
                  `${kind}을(를) ${count}개 판매했습니다.\n개당 가격은 ${sell.price}입니다.\n총 판매 가격은 ${sell.total}원입니다.\n잔액은 ${sell.user.money}원입니다.`
                ),
            ],
          });
        } else {
          await interaction.reply({
            embeds: [
              embed
                .setDescription(`보유 ${kind}가 부족합니다.`)
                .setColor("RED"),
            ],
          });
        }
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
