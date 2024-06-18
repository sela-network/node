import { fetcher, HttpMethod } from './fetcher';

export interface NodeAppStats {
	totalEarnings: number;
	totalUptime: number;
	todayEarnings: number;
	todayUptime: number;
}

export async function getScrapingStats() {
	return await fetcher<NodeAppStats>({ url: 'user/node-app/stats', method: HttpMethod.Get });
}

export async function claimUptimeReward(updateInterval: number) {
	return await fetcher<NodeAppStats>({
		method: HttpMethod.Post,
		url: 'user/node-app/claim/uptime',
		data: { updateInterval: updateInterval/1000 }
	});
}