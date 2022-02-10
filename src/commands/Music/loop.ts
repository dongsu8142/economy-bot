import { SlashCommandBuilder } from "@discordjs/builders";
import { QueueRepeatMode } from "discord-player";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("반복")
    .setDescription("반복 횟수를 설정합니다.")
    .addIntegerOption((option) =>
      option
        .setName("모드")
        .setDescription("반복 유형")
        .setRequired(true)
        .addChoice("끄기", QueueRepeatMode.OFF)
        .addChoice("현재 음악", QueueRepeatMode.TRACK)
        .addChoice("재생목록", QueueRepeatMode.QUEUE)
        .addChoice("자동 재생", QueueRepeatMode.AUTOPLAY)
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
    const loopMode = interaction.options.getInteger("모드", true);
    const success = queue.setRepeatMode(loopMode);
    const mode =
      loopMode === QueueRepeatMode.TRACK
        ? "🔂"
        : loopMode === QueueRepeatMode.QUEUE
        ? "🔁"
        : "▶";
    return void interaction.followUp({
      embeds: [
        embed
          .setDescription(
            success
              ? `${mode} | 모드를 업데이트했습니다.`
              : "반복 모드를 업데이트하지 못했습니다. 나중에 다시 시도해주세요."
          )
          .setColor(success ? embed.color! : "RED"),
      ],
    });
  },
} as CommandType;
