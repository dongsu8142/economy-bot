import { SlashCommandBuilder } from "@discordjs/builders";
import { request } from "undici";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("코로나")
    .setDescription("코로나 정보를 알려줍니다."),
  async execute(client, interaction, embed) {
    try {
      const { statusCode, body } = await request(
        "https://apiv3.corona-live.com/domestic/stat.json"
      );
      if (statusCode !== 200) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription("코로나 정보를 가져오는데 실패했습니다.")
              .setColor("RED"),
          ],
        });
      }
      const overview = (await body.json()).overview;
      interaction.reply({
        embeds: [
          embed
            .addField(
              "확진자",
              `${overview.confirmed[0]}(+${overview.confirmed[1]})`,
              true
            )
            .addField(
              "완치자",
              `${overview.recovered[0]}(+${overview.recovered[1]})`,
              true
            )
            .addField(
              "사망자",
              `${overview.deceased[0]}(+${overview.deceased[1]})`,
              true
            )
            .addField(
              "위중증자",
              `${overview.confirmedSevereSymptoms[0]}(+${overview.confirmedSevereSymptoms[1]})`,
              true
            ),
        ],
      });
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
