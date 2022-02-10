import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("정지")
    .setDescription("재생중인 노래를 정지하고 음성 채널을 나갑니다."),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("재생 중인 음악이 없습니다"),
        ],
      });
    queue.destroy();
    return void interaction.followUp({
      embeds: [embed.setDescription("재생을 정지하고 음성 채널을 나갑니다.")],
    });
  },
} as CommandType;
