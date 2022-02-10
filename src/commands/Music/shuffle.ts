import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("섞기")
    .setDescription("현재 재생목록의 모든 곡들을 랜덤으로 섞습니다."),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("재생 중인 음악이 없습니다"),
        ],
      });
    const success = queue.shuffle();
    interaction.followUp({
      embeds: [
        embed
          .setDescription(
            success
              ? `재생 목록을 랜덤하게 섞었습니다.`
              : "섞는 중에 실패하였습니다. 다음에 다시 시도해주세요."
          )
          .setColor(success ? embed.color! : "RED"),
      ],
    });
  },
} as CommandType;
