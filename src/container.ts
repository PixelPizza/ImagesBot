import { container } from "@sapphire/framework";
import Scraper from "images-scraper";

declare module "@sapphire/pieces" {
	export interface Container {
		imageSearch: Scraper;
	}
}

container.imageSearch = new Scraper({
	safe: true
});
