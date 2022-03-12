import type { Container } from "@sapphire/pieces";
import { Collection, Snowflake } from "discord.js";
import { Image } from "./Image";

export class ImageManager {
	public readonly cache: Collection<string, Image> = new Collection();

	public constructor(public readonly container: Container) {}

	public async create(options: { url: string; owner: Snowflake }) {
		const image = await this.fetchImage(options);
		this.cache.set(image.id, image);
		return image;
	}

	public fetch(id?: string, force = false) {
		if (!id) return [].map((image) => new Image({ container: this.container, data: image, owner: "" }));
		if (!force && this.cache.has(id)) return this.cache.get(id);
		return new Image({ container: this.container, data: "", owner: "" });
	}

	private fetchImage({ url, owner }: { url: string; owner: Snowflake }): Promise<Image> {
		return new Promise(async (resolve, reject) => {
			const stream = await this.container.fetch(url).then((response) => response.body);
			if (!stream) return reject(new Error("Unable to fetch image."));
			let data = Buffer.alloc(0, undefined, "utf8");
			stream
				.on("data", (chunk) => (data = Buffer.concat([data, chunk])))
				.on("end", () =>
					resolve(
						new Image({ container: this.container, data: this.container.serialize(data, "binary"), owner })
					)
				)
				.on("error", reject);
		});
	}
}
