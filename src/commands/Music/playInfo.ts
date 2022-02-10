import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("재생정보")
    .setDescription("현재 재생중인 음악 정보를 확인합니다."),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("재생 중인 음악이 없습니다"),
        ],
      });
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();
    const current = queue.current;

    return void interaction.followUp({
      embeds: [
        embed
          .setTitle(current.title)
          .setURL(current.url)
          .setThumbnail(current.thumbnail)
          .setAuthor({
            name: current.author,
          })
          .setDescription(`(\`${perc.progress}%\`)\n${progress}`),
      ],
    });
  },
} as CommandType;
