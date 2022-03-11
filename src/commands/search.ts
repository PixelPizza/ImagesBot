import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import type { Scraper } from "images-scraper";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

@ApplyOptions<Command.Options>({
	description: "Search for an image"
})
export class SearchCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			new SlashCommandBuilder()
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

		// @ts-ignore - Typings are wrong
		const results = (await this.container.imageSearch.scrape(
			interaction.options.getString("query", true),
			interaction.options.getInteger("limit", true)
		)) as Scraper.ScrapeResult[];

		const message = new PaginatedMessage().addPages(
			results.map((result) => ({
				embeds: [
					new MessageEmbed()
						.setColor("BLUE")
						.setTitle(result.title)
						.setURL(result.source)
						.setImage(result.url)
				]
			}))
		);

		await message.run(interaction);
	}
}
