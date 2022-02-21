import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";
const cooldown = new Set<string>();

export default {
  data: new SlashCommandBuilder()
    .setName("일하기")
    .setDescription("일을 해서 돈을 법니다."),
  async execute(client, interaction, embed) {
    if (cooldown.has(interaction.user.id)) {
      return interaction.reply({
        embeds: [
          embed
            .setDescription("일을 하려면 20분이 지나야 합니다.")
            .setColor("RED"),
        ],
      });
    }
    const user = await client.economySystem.fetch(interaction.user.id);
    if (!user)
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              "가입을 하지 않았습니다. 가입을 하시려면 /가입을 입력하세요."
            )
            .setColor("RED"),
        ],
      });
    const addMoney = Math.floor(Math.random() * 1000) + 1000;
    const total = user.money + addMoney;
    const updateUserMoney = await client.economySystem.setMoney(
      user.userId,
      total
    );
    if (!updateUserMoney) {
      return interaction.reply("오류가 발생했습니다.");
    }
    interaction.reply({
      embeds: [
        embed
          .setTitle(`일을 헤서 ${addMoney}원을 벌었습니다.`)
          .setDescription(`현재 돈은 ${total}원 입니다.`),
      ],
    });
    cooldown.add(interaction.user.id);
    setTimeout(() => {
      cooldown.delete(interaction.user.id);
    }, 1000 * 60 * 20);
  },
} as CommandType;
