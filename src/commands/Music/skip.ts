import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("스킵")
    .setDescription("노래를 스킵하고 다음 노래를 재생합니다."),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("재생 중인 음악이 없습니다"),
        ],
      });
    const currentTrack = queue.current;
    const success = queue.skip();
    interaction.followUp({
      embeds: [
        embed
          .setDescription(
            success
              ? `${currentTrack}을(를) 스킵하고 다음 노래를 재생합니다.`
              : "음악 스킵에 실패하였습니다. 다음에 다시 시도해주세요."
          )
          .setColor(success ? embed.color! : "RED"),
      ],
    });
  },
} as CommandType;
