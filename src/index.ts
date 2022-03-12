import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { config } from "dotenv";
import { existsSync, mkdirSync } from "fs";
import "./container";
import "@sapphire/plugin-logger/register";
config();

if (!existsSync("img")) mkdirSync("img");

const client = new SapphireClient({
	intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
	partials: ["CHANNEL", "MESSAGE"]
});

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

void client.login();
