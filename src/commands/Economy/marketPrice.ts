import { SlashCommandBuilder } from "@discordjs/builders";
import { CryptoCode } from "../../utils/enums";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("시세")
    .setDescription("주식이나 암호화폐의 시세를 확인합니다.")
    .addStringOption((option) =>
      option
        .setName("종류")
        .setRequired(true)
        .setDescription("주식 또는 암호화폐를 선택하세요.")
        .addChoice("암호화폐", "crypto")
        .addChoice("주식", "stock")
    ),
  async execute(client, intercation, embed) {
    const event = intercation.options.getString("종류", true);
    if (event === "crypto") {
      const newEmbed = embed
        .setTitle("암호화폐 시세")
        .setDescription(
          "실시간으로 불러와서 처리합니다. 판매또는 구매 가격이 달라질 수 있습니다."
        );
      Object.keys(CryptoCode).map((coin) => {
        newEmbed.addField(coin, client.crypto[coin] + "원", true);
      });
      return intercation.reply({
        embeds: [newEmbed],
      });
    } else {
      return intercation.reply({
        embeds: [embed.setDescription("아직 준비중입니다.")],
      });
    }
  },
} as CommandType;
