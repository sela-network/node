import { fetcher, HttpMethod } from './fetcher';

export interface NodeAppStats {
	totalEarnings: number;
	totalUptime: number;
	todayEarnings: number;
	todayUptime: number;
}

export interface NodeAppStatsHistory {
	date: Date;
	feedCount: number;
	totalPoints: number;
}

export interface ReferralData {
	referralCode: string;
	referrerCount: number;
	isReferred: boolean;
}

export async function getScrapingStats() {
	return await fetcher<NodeAppStats>({ url: 'node-app/stats', method: HttpMethod.Get });
}
export async function getReferralData() {
	return await fetcher<ReferralData>({ url: 'node-app/referral', method: HttpMethod.Get });
}

export async function getReferralPoints() {
	return await fetcher<number>({ url: 'node-app/referral/points', method: HttpMethod.Get });
}

export async function claimReferralPoints() {
	return await fetcher<number>({ url: 'node-app/referral/points/claim', method: HttpMethod.Post });
}

export async function submitReferralCode(code: string) {
	return await fetcher<ReferralData>({ url: 'node-app/referral', method: HttpMethod.Post, data: {code} });
}

export async function getScrapingStatsHistory() {
	return await fetcher<NodeAppStatsHistory[]>({ url: 'node-app/stats/history', method: HttpMethod.Get });
}

export async function claimUptimeReward(updateInterval: number) {
	return await fetcher<NodeAppStats>({
		method: HttpMethod.Post,
		url: 'node-app/claim/uptime',
		data: { updateInterval: updateInterval/1000 }
	});
}