import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v9";
import { CommandInteraction, ContextMenuInteraction, Message, MessageAttachment, MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
	description: "Copy an image"
})
export class CopyCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerContextMenuCommand(
			(builder) => builder.setType(ApplicationCommandType.Message).setName("Copy image"),
			{
				idHints: ["951939687700906064"]
			}
		);

		registry.registerContextMenuCommand(
			(builder) => builder.setType(ApplicationCommandType.User).setName("Copy avatar"),
			{
				idHints: ["951939688191647837"]
			}
		);

		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((input) =>
						input
							.setName("url")
							.setDescription("Copy an image from a URL")
							.addStringOption((input) =>
								input.setName("url").setDescription("The URL of the image").setRequired(true)
							)
					)
					.addSubcommand((input) =>
						input
							.setName("attachment")
							.setDescription("Copy an image from an attachment (not supported yet)")
					),
			{
				idHints: ["952332872709193729"]
			}
		);
	}

	public override async contextMenuRun(interaction: ContextMenuInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		if (interaction.isMessageContextMenu()) {
			const { targetMessage: message } = interaction;

			if (!(message instanceof Message)) return;

			const url = message.attachments.find(
				(attachment) => attachment.contentType !== null && /image\/(png|jpe?g)/.test(attachment.contentType)
			)?.url;

			if (!url) {
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor("RED")
							.setTitle("No image found")
							.setDescription("No valid image has been found.")
					]
				});
			}

			return this.copyImage(interaction, url);
		}

		if (interaction.isUserContextMenu()) {
			const { targetUser: user } = interaction;
			return this.copyImage(interaction, user.displayAvatarURL({ format: "png", size: 512 }));
		}
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		switch (interaction.options.getSubcommand(true)) {
			case "url":
				return this.chatInputURL(interaction);
			case "attachment":
				return this.chatInputAttachment(interaction);
		}
	}

	private async chatInputURL(interaction: CommandInteraction) {
		return this.copyImage(interaction, interaction.options.getString("url", true));
	}

	private async chatInputAttachment(interaction: CommandInteraction) {
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Not supported")
					.setDescription("The attachment command is not supported yet.")
			]
		});
	}

	private async copyImage(interaction: ContextMenuInteraction | CommandInteraction, url: string) {
		try {
			const image = await this.container.images.create({ url, owner: interaction.user.id });

			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("GREEN")
						.setTitle("Image copied")
						.setDescription("The selected image has been copied.")
						.addField("ID", image.id)
						.setImage("attachment://copy.png")
				],
				files: [new MessageAttachment(Buffer.from(image.data.toString(), "base64"), "copy.png")]
			});
		} catch (error) {
			this.container.logger.error(error);
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setTitle("Copy Failed")
						.setDescription("Unable to copy selected image.")
				]
			});
		}
	}
}
