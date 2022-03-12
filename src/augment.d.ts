declare module "googlethis" {
	export function getTopNews(): Promise<{
		headline_stories: { title: string; url: string; image?: string; published: string; by: string }[];
	}>;

	export function search(
		query: string,
		options?: { ris?: boolean; safe?: boolean; page?: number; match_all_images?: boolean; additional_params: any }
	): Promise<{
		results: {
			title: string;
			description: string;
			url: string;
			favicons: {
				high_res: string;
				low_res: string;
			};
		}[];
		did_you_mean?: string;
		knowledge_panel: {
			title: string;
			description: string;
			url: string;
			type?: string;
			books?: { title: string; year: string }[];
			tv_shows_and_movies?: { title: string; year: string }[];
			lyrics?: string;
			ratings?: { name: string; rating: string }[];
			available_on?: string[];
			images?: {
				url: string;
				source: string;
			}[];
			demonstration?: string;
			[key: string]: any;
		};
		featured_snippet: {
			title: string;
			description: string;
			url: string;
		};
		top_stories: { description: string; url: string }[];
		people_also_ask: string[];
		people_also_search_for: { title: string; thumbnail: string }[];
		unit_converter?:
			| {
					input: string;
					output: string;
					formula: string;
			  }
			| {
					input: {
						name: string;
						value: string;
					};
					output: {
						name: string;
						value: string;
					};
			  };
		weather?: {
			location: string;
			forecast: string;
			precipitation: string;
			humidity: string;
			temperature: string;
			wind: string;
		};
		current_time?: {
			hours: string;
			date: string;
		};
		location?: {
			title: string;
			distance: string;
			map: string;
		};
		dictionary?: {
			word: string;
			phonetic: string;
			audio: string;
			definitions: string[];
			examples: string[];
		};
		translation?: {
			source_language: string;
			target_language: string;
			source_text: string;
			target_text: string;
		};
	}>;

	export function image(
		query: string,
		options?: { safe?: boolean; exclude_domains?: string[]; additional_params?: any }
	): Promise<
		{
			url: string;
			width: string;
			height: string;
			origin: {
				title: string;
				website: string;
			};
		}[]
	>;
}
