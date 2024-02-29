import { Result } from "@mikuroxina/mini-fn";
import type { AutocompleteInteraction } from "discord.js";
import { getInstancesList } from "../apis/instance";

export async function responseAutocomplete(
	interaction: AutocompleteInteraction,
	projectId: string,
): Promise<Result.Result<Error, void>> {
	const result = await getInstancesList(projectId);
	if (Result.isErr(result)) {
		throw new Error(result[1].message);
	}

	const focusedValue = interaction.options.getFocused();
	const apiInstanceNames: string[] = result[1].map(
		(instance) => instance.instanceName,
	);

	const filteredInstanceNames = apiInstanceNames.filter((instanceName) => {
		return instanceName.includes(focusedValue);
	});

	try {
		await interaction.respond(
			filteredInstanceNames.map((items) => ({
				name: items,
				value: items,
			})),
		);
		return Result.ok(undefined);
	} catch (e) {
		return Result.err(e as unknown as Error);
	}
}
