import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("볼륨")
    .setDescription("볼륨을 확인하거나 조절합니다")
    .addNumberOption((option) =>
      option
        .setName("음량")
        .setDescription("변경하고 싶은 음량을 입력하세요")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(100)
    ),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("재생 중인 음악이 없습니다"),
        ],
      });
    const volume = interaction.options.getNumber("음량");
    if (!volume)
      return void interaction.followUp({
        embeds: [embed.setDescription(`현재 볼륨: ${queue.volume}`)],
      });
    const success = queue.setVolume(volume);
    interaction.followUp({
      embeds: [
        embed
          .setDescription(
            success
              ? `${volume}으로 볼륨을 변경했습니다`
              : "볼륨을 변경에 실패했습니다 나중에 다시 시도해주세요"
          )
          .setColor(success ? embed.color! : "RED"),
      ],
    });
  },
} as CommandType;
