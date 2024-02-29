import { Option, Result } from "@mikuroxina/mini-fn";
import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { launchInstance, shutdownInstance } from "./apis/action";
import { getInstancesList } from "./apis/instance";
import { responseAutocomplete } from "./commands/autocomplate";
import { registerCommand } from "./commands/register";

dotenv.config();

interface BotEnvs {
	DISCORD_API_TOKEN: string;
	WHITELIST_USERS: string[];
	DISCORD_GUILD_ID: string;
	GCP_PROJECT_ID: string;
}

export function getEnvs(): Option.Option<BotEnvs> {
	const {
		DISCORD_API_TOKEN,
		WHITELIST_USERS,
		DISCORD_GUILD_ID,
		GCP_PROJECT_ID,
	} = process.env;

	if (
		DISCORD_API_TOKEN === undefined ||
		WHITELIST_USERS === undefined ||
		DISCORD_GUILD_ID === undefined ||
		GCP_PROJECT_ID === undefined
	) {
		return Option.none();
	}

	const whitelistUsers = WHITELIST_USERS.split(",");
	return Option.some({
		DISCORD_API_TOKEN,
		WHITELIST_USERS: whitelistUsers,
		DISCORD_GUILD_ID,
		GCP_PROJECT_ID,
	});
}

const envs = getEnvs();
if (Option.isNone(envs)) {
	throw new Error("Environment variables are not set properly");
}
const { DISCORD_API_TOKEN, WHITELIST_USERS, DISCORD_GUILD_ID, GCP_PROJECT_ID } =
	envs[1];
const intents: GatewayIntentBits[] = [GatewayIntentBits.GuildMembers];
const client = new Client({ intents });

client.on(Events.ClientReady, async () => {
	const clientUser = client.user;
	if (clientUser === null) {
		throw new Error("Failed to get client user");
	}

	const result = await registerCommand(
		DISCORD_API_TOKEN,
		clientUser.id,
		DISCORD_GUILD_ID,
	);
	if (Result.isErr(result)) {
		throw new Error(result[1].message);
	}
	console.log("Successfully registered commands.");

	console.log("Logged in as", clientUser.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const authorId = interaction.user.id;
		const instanceName = interaction.options.getString("instance_name", true);

		if (!WHITELIST_USERS.includes(authorId)) {
			await interaction.reply("You are not allowed to use this command.");
			return;
		}

		switch (interaction.commandName) {
			case "launch": {
				const result = await launchInstance(GCP_PROJECT_ID, instanceName);
				if (Result.isErr(result)) {
					await interaction.reply(result[1].message);
					return;
				}
				await interaction.reply(`Instance ${instanceName} started.`);
				break;
			}
			case "shutdown": {
				const result = await shutdownInstance(GCP_PROJECT_ID, instanceName);
				if (Result.isErr(result)) {
					await interaction.reply(result[1].message);
					return;
				}
				await interaction.reply(`Instance ${instanceName} stopped.`);
				break;
			}
		}
	} else if (interaction.isAutocomplete()) {
		await responseAutocomplete(interaction, GCP_PROJECT_ID);
	}
});

client.login(DISCORD_API_TOKEN);
