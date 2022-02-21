import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";
const RSP = ["가위", "바위", "보"];

export default {
  data: new SlashCommandBuilder()
    .setName("가위바위보")
    .setDescription("배팅을 하여 가위바위보를 합니다.")
    .addStringOption((option) =>
      option
        .setName("종류")
        .setDescription("가위바위보 종류를 선택해주세요")
        .setRequired(true)
        .addChoice("가위", "가위")
        .addChoice("바위", "바위")
        .addChoice("보", "보")
    )
    .addNumberOption((option) =>
      option
        .setName("액수")
        .setDescription("배팅할 액수를 입력해주세요.")
        .setRequired(true)
    ),
  async execute(client, interaction, embed) {
    try {
      const kind = interaction.options.getString("종류", true);
      const bet = interaction.options.getNumber("액수", true);
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
      if (user.money < bet) {
        return interaction.reply({
          embeds: [
            embed
              .setDescription(
                "돈이 부족합니다. 현재 보유한 돈은 " + user.money + "입니다."
              )
              .setColor("RED"),
          ],
        });
      }
      const result = Math.floor(Math.random() * 3);
      let description = "";
      if (kind === "가위") {
        if (RSP[result] === "가위") {
          description = "비겼습니다.";
        } else if (RSP[result] === "바위") {
          description = "졌습니다.";
        } else {
          description = "이겼습니다.";
        }
      } else if (kind === "바위") {
        if (RSP[result] === "가위") {
          description = "이겼습니다.";
        } else if (RSP[result] === "바위") {
          description = "비겼습니다.";
        } else {
          description = "졌습니다.";
        }
      } else {
        if (RSP[result] === "가위") {
          description = "졌습니다.";
        } else if (RSP[result] === "바위") {
          description = "이겼습니다.";
        } else {
          description = "비겼습니다.";
        }
      }
      let total = user.money;
      if (description === "이겼습니다.") {
        total += bet;
        await client.economySystem.setMoney(interaction.user.id, total);
      } else if (description === "졌습니다.") {
        total -= bet;
        await client.economySystem.setMoney(interaction.user.id, total);
      }
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `${description}\n현재 보유한 돈은 ${total}입니다.`
          ),
        ],
      });
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
