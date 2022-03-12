import { container } from "@sapphire/framework";
import google from "googlethis";
import type fetch from "node-fetch";
import type { RequestInfo, RequestInit } from "node-fetch";
import { brotliCompressSync, brotliDecompressSync, InputType } from "node:zlib";
import { ImageManager } from "./lib/ImageManager";

declare module "@sapphire/pieces" {
	export interface Container {
		search: typeof google;
		fetch: typeof fetch;
		serialize(data: InputType, encoding?: BufferEncoding): string;
		deserialize(data: InputType, options: { fromEncoding?: BufferEncoding; toEncoding: BufferEncoding }): string;
		images: ImageManager;
	}
}

container.search = google;
container.fetch = (input: RequestInfo, init?: RequestInit) =>
	import("node-fetch").then(({ default: fetch }) => fetch(input, init));

container.serialize = (data: InputType, encoding?: BufferEncoding) => brotliCompressSync(data).toString(encoding);
container.deserialize = (
	data: InputType,
	{ fromEncoding, toEncoding }: { fromEncoding?: BufferEncoding; toEncoding?: BufferEncoding } = {}
) => brotliDecompressSync(typeof data === "string" ? Buffer.from(data, fromEncoding) : data).toString(toEncoding);

container.images = new ImageManager(container);
