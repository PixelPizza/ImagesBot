import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

@ApplyOptions<Command.Options>({
	description: "Search for an image"
})
export class SearchCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) =>
					input.setName("query").setDescription("The query to search for").setRequired(true)
				)
				.addIntegerOption((input) =>
					input
						.setName("limit")
						.setDescription("The limit of images to return")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(25)
				)
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply({
			embeds: [
				new MessageEmbed().setColor("BLUE").setTitle("Searching").setDescription("Searching for images...")
			],
			ephemeral: true
		});

		const results = (
			await this.container.search.image(interaction.options.getString("query", true), {
				safe: true,
				exclude_domains: ["instagram.com", "facebook.com", "wikimedia.org", "twitter.com", "youtube.com"]
			})
		)
			.filter(
				(result) =>
					/^https?:\/\//.test(result.origin.website) &&
					!["gstatic.com", "static-rmg.be", "persgroep.net"].some((url) => result.url.includes(url))
			)
			.splice(0, interaction.options.getInteger("limit", true));

		const message = new PaginatedMessage().addPages(
			results.map((result) => ({
				embeds: [
					new MessageEmbed()
						.setColor("BLUE")
						.setTitle(result.origin.title)
						.setURL(result.origin.website)
						.setImage(result.url)
						.addFields(
							{
								name: "Width",
								value: result.width,
								inline: true
							},
							{
								name: "Height",
								value: result.height,
								inline: true
							}
						)
				]
			}))
		);

		await message.run(interaction);
	}
}
