import { useEffect, useRef, useState } from 'react';
import { insertionScript } from '../lib/scrape.utils';
import { getNextTask, NodeAppTask, NodeAppTasks, submitComments, submitRecentPostTask } from '../api/task';
import { sleep } from '../lib/utils';
import { useTwitterLoggedIn } from '../stores/app-store';

export function TwitterTaskRunner() {
	const webviewRef = useRef();
	const [taskRunning, setTaskRunning] = useState(false);
	const twitterLoggedIn = useTwitterLoggedIn();

	async function getJob() {
		const res = await getNextTask();
		// const res = {
		// 	"type": NodeAppTasks.SCRAPE_POST_COMMENTS,
		// 	"userName": "rektcapital",
		// 	"createdAt": new Date(),
		// 	"id": "211",
		// 	tweetId: '1805066389482565982'
		// };
		// await sleep(2000);
		if (res) {
			await executeTask(res);
		} else {
			setTimeout(() => {
				void getJob();
			}, 10000);
		}
	}


	useEffect(() => {
		if (!twitterLoggedIn) {
			return;
		}
		if (!taskRunning) {
			void getJob();
		}
	}, [taskRunning, twitterLoggedIn]);

	async function executeTask(task: NodeAppTask) {
		try {
			setTaskRunning(true);
			const webview = webviewRef.current;
			if (!webview) {
				console.log('error, not webview defined');
				setTaskRunning(false);
				return;
			}
			if (task.type === NodeAppTasks.SCRAPE_RECENT_POST_OF_USER) {
				// @ts-ignore
				await webview.loadURL(`https://x.com/${task.userName}`);

				await sleep(5000);

				const js = `
			${insertionScript}
			getFirstPostData();
			`;
				// @ts-ignore
				const post = await webview.executeJavaScript(js);

				if (!post?.content) {
					console.log('task failed, backing off', post);
					await sleep(20000);
				} else {
					await submitRecentPostTask({ ...post, userName: task.userName, taskId: task.id });
					// backoff time
					await sleep(2000);
				}
			} else if (task.type === NodeAppTasks.SCRAPE_POST_COMMENTS) {
				if(!task.tweetId) {
					console.log('tweetId missing in task, exiting');
					await sleep(100);
					setTaskRunning(false);

					return;
				}
				// @ts-ignore
				await webview.loadURL(`https://x.com/${task.userName}/status/${task.tweetId}`);
				await sleep(5000);

				// @ts-ignore
				await webview.executeJavaScript(`
			${insertionScript}
			showHiddenComments();
			`);
				await sleep(1000);
				// @ts-ignore
				const comments = await webview.executeJavaScript(`getComments();`);
				if (comments.length) {
					await submitComments({comments, tweetId: task.tweetId});
					await sleep(3000);
				} else {
					console.log('no comments, backing off');
					await sleep(3000);
				}
			}
		} catch (e) {
			console.log('task failed error', e);
		} finally {
			setTaskRunning(false);
		}
	}

	useEffect(() => {
		// @ts-ignore
		window.webview = webviewRef?.current;
	}, [webviewRef.current]);

	if (!twitterLoggedIn) {
		return null;
	}

	return <div className='absolute top-0 left-0 w-full h-full -z-50'>
		<webview src='https://x.com' ref={webviewRef} id='foo' style={{ width: '100%', height: '100%' }}></webview>
	</div>;
}