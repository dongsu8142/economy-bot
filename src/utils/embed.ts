import { CommandInteraction, MessageEmbed } from "discord.js";

export default (interaction: CommandInteraction) => {
  const embed = new MessageEmbed()
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.avatarURL() || "",
    })
    .setTimestamp(new Date())
    .setColor("#A1C4FD");
  return embed;
};
