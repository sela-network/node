import { fetcher, HttpMethod } from './fetcher';

interface BaseTask {
	createdAt: Date;
	processBy: Date;
	id: string;
}
export interface ScrapeRecentPostTask extends BaseTask {
	type: NodeAppTasks.SCRAPE_RECENT_POST_OF_USER;
	userName: string;
}

export type NodeAppTask = ScrapeRecentPostTask;

export enum NodeAppTasks {
	SCRAPE_RECENT_POST_OF_USER = 'SCRAPE_RECENT_POST_OF_USER',
}


export async function getNextTask() {
	return await fetcher<NodeAppTask | null>({ url: 'node-app/task', method: HttpMethod.Get });
}

export async function submitRecentPostTask(data: Record<string, string>) {
	return await fetcher<NodeAppTask | null>({ url: `node-app/task/${NodeAppTasks.SCRAPE_RECENT_POST_OF_USER}/submit`, method: HttpMethod.Post, data });
}
