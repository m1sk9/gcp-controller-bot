import { Option, Result } from "@mikuroxina/mini-fn";
import { createInstancesClient, getInstance } from "./instance";

export async function launchInstance(
	projectId: string,
	name: string,
): Promise<Result.Result<Error, void>> {
	const client = createInstancesClient();

	const instance = await getInstance(projectId, name);
	if (Option.isNone(instance)) {
		return Result.err(new Error("Instance not found"));
	}

	const request = {
		project: projectId,
		instance: instance[1].instanceName,
		zone: instance[1].zone,
	};

	try {
		await client.start(request);
		console.log(`Instance ${name} started`);

		return Result.ok(undefined);
	} catch (error) {
		return Result.err(error as unknown as Error);
	}
}

export async function shutdownInstance(
	projectId: string,
	name: string,
): Promise<Result.Result<Error, void>> {
	const client = createInstancesClient();

	const instance = await getInstance(projectId, name);
	if (Option.isNone(instance)) {
		return Result.err(new Error("Instance not found"));
	}

	const request = {
		project: projectId,
		instance: instance[1].instanceName,
		zone: instance[1].zone,
	};

	try {
		await client.stop(request);
		console.log(`Instance ${name} stopped`);

		return Result.ok(undefined);
	} catch (error) {
		return Result.err(error as unknown as Error);
	}
}
