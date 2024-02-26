import { Option, Result } from "@mikuroxina/mini-fn";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { registerCommand } from "./commands/register";

dotenv.config();

interface BotEnvs {
	DISCORD_API_TOKEN: string;
	WHITELIST_USERS: string[];
	DISCORD_GUILD_ID: string;
}

export function getEnvs(): Option.Option<BotEnvs> {
	const { DISCORD_API_TOKEN, WHITELIST_USERS, DISCORD_GUILD_ID } = process.env;

	if (
		DISCORD_API_TOKEN === undefined ||
		WHITELIST_USERS === undefined ||
		DISCORD_GUILD_ID === undefined
	) {
		return Option.none();
	}

	const whitelistUsers = WHITELIST_USERS.split(",");
	return Option.some({
		DISCORD_API_TOKEN,
		WHITELIST_USERS: whitelistUsers,
		DISCORD_GUILD_ID,
	});
}

const envs = getEnvs();
if (Option.isNone(envs)) {
	throw new Error("Environment variables are not set properly");
}
const { DISCORD_API_TOKEN, WHITELIST_USERS, DISCORD_GUILD_ID } = envs[1];
const intents: GatewayIntentBits[] = [GatewayIntentBits.GuildMembers];
const client = new Client({ intents });

client.on("ready", async () => {
	const clientUser = client.user;
	if (clientUser === null) {
		throw new Error("Failed to get client user");
	}
	console.log(`Logged in as ${clientUser.tag}`);

	const result = await registerCommand(
		DISCORD_API_TOKEN,
		clientUser.id,
		DISCORD_GUILD_ID,
	);
	if (Result.isErr(result)) {
		throw new Error(result[1].message);
	}
	console.log("Successfully registered commands");
});

client.login(DISCORD_API_TOKEN);