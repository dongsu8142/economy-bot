import { SlashCommandBuilder } from "@discordjs/builders";
import { QueryType, Track } from "discord-player";
import { GuildMember } from "discord.js";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("검색")
    .setDescription("노래를 검색하고 재생합니다.")
    .addNumberOption((option) =>
      option
        .setName("검색엔진")
        .setDescription("검색엔진을 선택해주세요.")
        .setRequired(true)
        .addChoice("유튜브", QueryType.YOUTUBE_SEARCH)
        .addChoice("사운드클라우드", QueryType.SOUNDCLOUD_SEARCH)
    )
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
    const queue = client.player.createQueue(interaction.guild!, {
      metadata: {
        channel: interaction.channel,
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
    const query = interaction.options.getString("노래", true);
    const searchEngine = interaction.options.getNumber("검색엔진", true);
    const searchResult = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine,
    });
    let tracks: Track[];
    if (searchResult.tracks.length >= 10) {
      tracks = searchResult.tracks.slice(0, 10);
    } else {
      tracks = searchResult.tracks;
    }
    if (!tracks)
      return await interaction.followUp({
        embeds: [
          embed.setColor("RED").setDescription("노래를 찾을 수 없습니다."),
        ],
      });
    let i = 0;
    const tracksInfo = tracks.map(
      (track) => `${++i}) [${track.author} - ${track.title}](${track.url})`
    );
    await interaction.followUp({
      embeds: [embed.setDescription(tracksInfo.join("\n"))],
      fetchReply: true,
    });
    const collected = await interaction.channel
      ?.awaitMessages({
        filter: (m) =>
          m.author.id === interaction.user.id && parseInt(m.content) <= 10,
        max: 1,
        time: 1000 * 60,
        errors: ["time"],
      })
      .catch(() => {
        interaction.followUp({
          embeds: [
            embed.setDescription("시간을 초과하였습니다.").setColor("RED"),
          ],
        });
      });
    if (!collected?.first()?.content) return;
    const track = tracks[parseInt(collected?.first()?.content!) - 1];
    try {
      await queue.play(track);
      return await interaction.followUp({
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
    } catch (error) {
      interaction.followUp({
        embeds: [
          embed
            .setColor("RED")
            .setDescription("음악을 재생하다가 에러가 발생했습니다."),
        ],
      });
    }
  },
} as CommandType;
