import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandType } from "../../utils/types";

export default {
  data: new SlashCommandBuilder()
    .setName("도움말")
    .setDescription("도움말을 보여줍니다."),
  async execute(client, interaction, embed) {
    const helpEmbed = embed.setTitle("도움말");
    client.commands.map((command) => {
      helpEmbed.addField(command.data.name, command.data.description, true);
    });
    interaction.reply({ embeds: [helpEmbed] });
  },
} as CommandType;
