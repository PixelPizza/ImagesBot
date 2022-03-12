import { container } from "@sapphire/framework";
import google from "googlethis";

declare module "@sapphire/pieces" {
	export interface Container {
		search: typeof google;
	}
}

container.search = google;
