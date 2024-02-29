import compute from "@google-cloud/compute";
import { Result } from "@mikuroxina/mini-fn";
import type { InstanceListType } from "./types";

export function createInstancesClient() {
	const client = new compute.InstancesClient();
	return client;
}

export async function getInstancesList(
	projectId: string,
): Promise<Result.Result<Error, InstanceListType[]>> {
	const instancesClient = createInstancesClient();

	const instanceListRequest = instancesClient.aggregatedListAsync({
		project: projectId,
		maxResults: 10,
	});

	const instanceList: InstanceListType[] = [];

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

	console.log(instanceList);
	return Result.ok(instanceList);
}
