import { fetcher, HttpMethod } from './fetcher';

interface BaseTask {
	createdAt: Date;
	id: string;
}

export interface ScrapeRecentPostTask extends BaseTask {
	type: NodeAppTasks.SCRAPE_RECENT_POST_OF_USER;
	userName: string;
}

export interface ScrapePostCommentsTask extends BaseTask {
	type: NodeAppTasks.SCRAPE_POST_COMMENTS;
	userName: string;
	tweetId: string;
}

export type NodeAppTask = ScrapeRecentPostTask | ScrapePostCommentsTask;

export enum NodeAppTasks {
	SCRAPE_RECENT_POST_OF_USER = 'SCRAPE_RECENT_POST_OF_USER',
	SCRAPE_POST_COMMENTS = 'SCRAPE_POST_COMMENTS',
}

export async function getNextTask() {
	try {
		return await fetcher<NodeAppTask | null>({ url: 'node-app/task', method: HttpMethod.Get });
	} catch (e) {
		return false;
	}
}

export async function submitRecentPostTask(data: Record<string, string>) {
	return await fetcher<NodeAppTask | null>({
		url: `node-app/task/${NodeAppTasks.SCRAPE_RECENT_POST_OF_USER}/submit`,
		method: HttpMethod.Post,
		data,
	});
}

export async function submitComments(data: Record<string, string>) {
	return await fetcher<NodeAppTask | null>({
		url: `node-app/task/${NodeAppTasks.SCRAPE_POST_COMMENTS}/submit`,
		method: HttpMethod.Post,
		data,
	});
}
