import { SlashCommandBuilder } from "@discordjs/builders";
import canvacord from "canvacord";
import { GuildMember, MessageAttachment } from "discord.js";
import { CommandType } from "../../utils/types";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("랭크")
    .setDescription("레벨 랭크를 보여줍니다."),
  async execute(client, interaction, embed) {
    const target = interaction.member as GuildMember;
    const user = await client.levelSystem.fetch(target.id);
    if (!user)
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              "가입을 하지 않았습니다. 가입을 하시려면 /가입을 입력하세요."
            )
            .setColor("RED"),
        ],
      });
    const neededXp = client.levelSystem.xpFor(user.level + 1);
    const rank = new canvacord.Rank()
      .registerFonts([
        {
          path: path.join(__dirname, "../../../assets/NotoSansKR.otf"),
          face: { family: "Noto Sans KR" },
        },
      ])
      .setAvatar(target.displayAvatarURL({ dynamic: false, format: "png" }))
      .setCurrentXP(user.xp)
      .setRequiredXP(neededXp)
      .setStatus(
        target.presence?.status
          ? target.presence?.status == "invisible"
            ? "online"
            : target.presence?.status
          : "online",
        true
      )
      .setProgressBar("#FFA500", "COLOR")
      .setUsername(target.user.username)
      .setLevel(user.level)
      .setBackground(
        "COLOR",
        target.user.hexAccentColor ? target.user.hexAccentColor : undefined
      )
      .setDiscriminator(target.user.discriminator);
    rank.build({}).then((data) => {
      const attachment = new MessageAttachment(data, "card.png");
      interaction.reply({ files: [attachment] });
    });
  },
} as CommandType;
