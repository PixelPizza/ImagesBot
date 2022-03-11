import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from "@sapphire/framework";
import { config } from "dotenv";
import "./container";
config();

const client = new SapphireClient({
	intents: ["GUILDS"]
});

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

void client.login();
