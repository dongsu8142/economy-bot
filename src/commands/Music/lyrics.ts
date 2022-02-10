import { Lyrics } from "@discord-player/extractor";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";
const lyricsClient = Lyrics.init(process.env.GENIUS_ACCESS_TOKEN);

export default {
  data: new SlashCommandBuilder()
    .setName("자막")
    .setDescription("자막을 검색합니다.")
    .addStringOption((option) =>
      option
        .setName("재목")
        .setDescription("검색하고 싶은 재목을 입력하세요.")
        .setRequired(true)
    ),
  async execute(client, interaction, embed) {
    const title = interaction.options.getString("재목", true);
    await interaction.deferReply();
    try {
      const lyrics = await lyricsClient.search(title);
      if (lyrics.lyrics) {
        interaction.followUp({
          embeds: [
            embed
              .setTitle(`${lyrics.title}`)
              .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url,
              })
              .setURL(lyrics.url)
              .setThumbnail(lyrics.thumbnail)
              .setImage(lyrics.image)
              .setDescription(lyrics.lyrics),
          ],
        });
      } else {
        interaction.followUp({
          embeds: [
            embed.setDescription(`자막을 찾을 수 없습니다.`).setColor("RED"),
          ],
        });
      }
    } catch (e) {
      interaction.followUp({
        embeds: [
          embed
            .setTitle(`자막을 가져오는 중 오류가 발생했습니다.`)
            .setColor("RED"),
        ],
      });
    }
  },
} as CommandType;
