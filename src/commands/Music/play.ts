import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { CommandType } from "../../utils/types";
import playdl from "play-dl";
import internal from "stream";

export default {
  data: new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) =>
      option
        .setName("노래")
        .setDescription("노래 제목을 입력하세요.")
        .setRequired(true)
    ),
  async execute(client, interaction, embed) {
    const member = interaction.member as GuildMember;
    if (!member.voice.channelId)
      return await interaction.reply({
        embeds: [
          embed
            .setColor("RED")
            .setDescription("채널에 들어가서 음악을 재생해주세요."),
        ],
        ephemeral: true,
      });
    if (
      interaction.guild?.me?.voice.channelId &&
      member.voice.channelId !== interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        embeds: [
          embed
            .setColor("RED")
            .setDescription(
              "노래를 재생하는 채널과 다른 채널에서 음악을 재생할 수 없습니다."
            ),
        ],
        ephemeral: true,
      });
    const query = interaction.options.getString("노래", true);
    const queue = client.player.createQueue(interaction.guild!, {
      metadata: {
        channel: interaction.channel,
      },
      async onBeforeCreateStream(track, source, _queue) {
        if (source === "youtube") {
          try {
            return (
              await playdl.stream(track.url, {
                discordPlayerCompatibility: true,
              })
            ).stream;
          } catch (e) {
            return internal.Readable.from(track.url);
          }
        }
        return internal.Readable.from(track.url);
      },
    });

    try {
      if (!queue.connection) await queue.connect(member.voice.channel!);
    } catch {
      queue.destroy();
      return await interaction.reply({
        embeds: [
          embed
            .setColor("RED")
            .setDescription("음성 채널에 들어갈 수 없습니다."),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const track = await client.player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("노래를 찾을 수 없습니다."),
        ],
      });

    try {
      await queue.play(track);
    } catch (err) {
      return await interaction.followUp({
        embeds: [
          embed
            .setColor("RED")
            .setDescription("음악을 재생하다가 에러가 발생했습니다."),
        ],
      });
    }

    await interaction.followUp({
      embeds: [
        embed
          .setTitle(track.title)
          .setAuthor({ name: track.author })
          .setDescription(track.description ? track.description : "")
          .setURL(track.url)
          .setThumbnail(track.thumbnail)
          .setFields([
            {
              name: "업로더",
              value: track.author,
              inline: true,
            },
            {
              name: "길이",
              value: track.duration,
              inline: true,
            },
            {
              name: "재생 수",
              value: track.views.toString(),
              inline: true,
            },
            {
              name: "소스",
              value: track.source,
              inline: true,
            },
          ]),
      ],
    });
  },
} as CommandType;
