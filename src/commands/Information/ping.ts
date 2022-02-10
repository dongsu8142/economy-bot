import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("핑")
    .setDescription("지연시간을 확인합니다."),
  async execute(client, interaction, embed) {
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guild!);
    interaction.followUp({
      embeds: [
        embed.setTitle("지연사간").setFields([
          {
            name: "봇 지연시간",
            value: `\`${Math.round(client.ws.ping)}ms\``,
          },
          {
            name: "음성채널 지연시간",
            value: !queue
              ? "N/A"
              : `UDP: \`${
                  queue.connection.voiceConnection.ping.udp ?? "N/A"
                }\`ms\nWebSocket: \`${
                  queue.connection.voiceConnection.ping.ws ?? "N/A"
                }\`ms`,
          },
        ]),
      ],
    });
  },
} as CommandType;
