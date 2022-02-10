import { GuildMember, Interaction, MessageEmbed } from "discord.js";
import DiscordClient from "../client/client";
import embed from "../utils/embed";
import { EventType } from "../utils/types";

export default {
  name: "interactionCreate",
  async execute(client: DiscordClient, interaction: Interaction) {
    if (!interaction.isCommand() || !interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    const baseEmbed = embed(interaction);

    if (!command) {
      return interaction.reply({
        embeds: [
          baseEmbed
            .setColor("RED")
            .setDescription("명령어를 찾을 수 없습니다."),
        ],
      });
    }

    const member = interaction.member as GuildMember;

    if (command.permissions && member.permissions.has(command.permissions)) {
      return interaction.reply({
        embeds: [baseEmbed.setDescription(`당신은 사용 권한이 없습니다.`)],
        ephemeral: true,
      });
    }

    if (
      command.permissions &&
      interaction.guild?.me?.permissions.has(command.permissions)
    ) {
      return interaction.reply({
        embeds: [baseEmbed.setDescription(`봇이 사용 권한이 없습니다.`)],
        ephemeral: true,
      });
    }

    try {
      await command.execute(client, interaction, baseEmbed);
    } catch (err) {
      console.log(err);
      await interaction.reply({
        embeds: [
          baseEmbed
            .setColor("RED")
            .setDescription("명령을 실행하는 동안 오류가 발생했습니다."),
        ],
        ephemeral: true,
      });
    }
  },
} as EventType;
