import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("재생목록")
    .setDescription("재생목록을 확인합니다."),
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
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. **${m.title}** ([link](${m.url}))`;
    });

    return void interaction.followUp({
      embeds: [
        embed
          .setTitle("재생목록")
          .setDescription(
            `${tracks.join("\n")}${
              queue.tracks.length > tracks.length
                ? `\n...${
                    queue.tracks.length - tracks.length === 1
                      ? `${queue.tracks.length - tracks.length} more track`
                      : `${queue.tracks.length - tracks.length} more tracks`
                  }`
                : ""
            }`
          )
          .setFields([
            {
              name: "재생 중인 음악",
              value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`,
            },
          ]),
      ],
    });
  },
} as CommandType;
