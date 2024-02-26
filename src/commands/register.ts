import { Result } from "@mikuroxina/mini-fn";
import { REST, Routes } from "discord.js";

interface CommandData {
	name: string;
	type: number;
	description: string;
	options?: CommandOptionData[];
}

interface CommandOptionData {
	name: string;
	description: string;
	type: number;
	required?: boolean;
	autocomplete?: boolean;
	// note: gcp-controller-bot does not use choices
}

export async function registerCommand(
	token: string,
	clientId: string,
	guildId: string,
): Promise<Result.Result<Error, void>> {
	const rest = new REST({ version: "10" }).setToken(token);

	const commandsData = await getRegisterCommands();
	if (Result.isErr(commandsData)) {
		return Result.err(new Error("Failed to get commands data"));
	}

	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandsData[1],
		});
		return Result.ok(undefined);
	} catch (e) {
		return Result.err(e as unknown as Error);
	}
}

async function getRegisterCommands(): Promise<
	Result.Result<Error, CommandData[]>
> {
	const commandsDataFile = Bun.file("./src/commands/commands.json");

	try {
		const commandsData = (await commandsDataFile.json()) as CommandData[];
		return Result.ok(commandsData);
	} catch (e) {
		return Result.err(e as unknown as Error);
	}
}
