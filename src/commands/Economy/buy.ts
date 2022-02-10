import { SlashCommandBuilder } from "@discordjs/builders";
import { CryptoCode } from "../../utils/enums";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("구매")
    .setDescription("주식 또는 암호화폐을 구매합니다.")
    .addStringOption((option) => {
      Object.keys(CryptoCode).map((coin) => {
        option.addChoice(coin, coin);
      });
      return option
        .setName("종류")
        .setRequired(true)
        .setDescription("구매하고 싶은 종류를 선택하세요.");
    })
    .addNumberOption((option) =>
      option
        .setName("개수")
        .setMinValue(1)
        .setRequired(true)
        .setDescription("구매하고 싶은 개수를 입력하세요.")
    ),
  async execute(client, interaction, embed) {
    try {
      const kind = interaction.options.getString("종류", true);
      const price = client.crypto[kind];
      const user = await client.economyRepository.findOne({
        userId: interaction.user.id,
      });
      if (user) {
        const count = interaction.options.getNumber("개수", true);
        const total = price * count;
        if (user.money >= total) {
          user[kind] += count;
          user["money"] -= total;
          const newUser = await client.economyRepository.save(user);
          await interaction.reply({
            embeds: [
              embed
                .setTitle("구매 완료")
                .setDescription(
                  `${kind}을(를) ${count}개 구매했습니다.\n개당 가격은 ${price}입니다.\n총 구매 가격은 ${total}원입니다.\n잔액은 ${newUser.money}원입니다.`
                ),
            ],
          });
        } else {
          await interaction.reply({
            embeds: [embed.setDescription("돈이 부족합니다.").setColor("RED")],
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
