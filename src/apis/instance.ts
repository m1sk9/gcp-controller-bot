import compute from "@google-cloud/compute";
import { Option, Result } from "@mikuroxina/mini-fn";
import type { InstanceType } from "./types";

export function createInstancesClient() {
	const client = new compute.InstancesClient();
	return client;
}

export async function getInstancesList(
	projectId: string,
): Promise<Result.Result<Error, InstanceType[]>> {
	const client = createInstancesClient();

	const instanceListRequest = client.aggregatedListAsync({
		project: projectId,
		maxResults: 10,
	});

	const instanceList: InstanceType[] = [];

	for await (const [zone, instancesObject] of instanceListRequest) {
		const instances = instancesObject.instances;

		if (!instances) {
			return Result.err(new Error("Failed to get instances"));
		}

		for (const instance of instances) {
			if (!instance.name || !instance.machineType || !zone) {
				return Result.err(new Error("Failed to get instance data"));
			}
			instanceList.push({
				instanceName: instance.name,
				zone: zone,
				machineType: instance.machineType,
			});
		}
	}

	return Result.ok(instanceList);
}

export async function getInstance(
	projectId: string,
	name: string,
): Promise<Option.Option<InstanceType>> {
	const instanceListRequest = await getInstancesList(projectId);
	if (Result.isErr(instanceListRequest)) {
		return Option.none();
	}

	const findResult = instanceListRequest[1].find(
		(instance) => instance.instanceName === name,
	);

	if (findResult === undefined) {
		return Option.none();
	}

	const instance: InstanceType = {
		instanceName: findResult.instanceName,
		zone: findResult.zone.replace("zones/", ""),
		machineType: findResult.machineType,
	};

	return Option.some(instance);
}
