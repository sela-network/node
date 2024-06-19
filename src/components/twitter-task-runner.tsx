import { useEffect, useRef, useState } from 'react';
import { getFirstPostData } from '../lib/scrape.utils';
import { getNextTask, NodeAppTask, NodeAppTasks, submitRecentPostTask } from '../api/task';
import { sleep } from '../lib/utils';

export function TwitterTaskRunner() {
	const [loggedIn, setLoggedIn] = useState(false);
	const webviewRef = useRef();


	async function getJob() {
		const res = await getNextTask();
		if (res) {
			await executeTask(res);
		}
	}

	async function executeTask(task: NodeAppTask) {
		const webview = webviewRef.current;
		if (!webview) {
			console.log('error, not webview defined');
			return;
		}

		if (task.type === NodeAppTasks.SCRAPE_RECENT_POST_OF_USER) {
			// @ts-ignore
			await webview.loadURL(`https://x.com/${task.userName}`);

			await sleep(4000);
			// @ts-ignore
			const post = await webview.executeJavaScript(`
			${getFirstPostData.toString()}
		
			getFirstPostData()
			`);

			await submitRecentPostTask({ ...post, userName: task.userName, taskId: task.id });
		}
	}

	useEffect(() => {
		if (loggedIn) {
			void getJob();
		}
	}, [loggedIn]);

	useEffect(() => {
		// @ts-ignore
		window.webview = webviewRef?.current;
	}, [webviewRef.current]);

	async function checkTwitterLogin() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const loggedIn = (await (
			window as any
		).methods.isTwitterLoggedIn()) as boolean;

		setLoggedIn(loggedIn);
	}

	useEffect(() => {
		void checkTwitterLogin();
	}, []);


	return <div className='absolute top-0 left-0 w-full h-full'>
		<webview src='https://x.com' ref={webviewRef} id='foo' style={{ width: '100%', height: '100%' }}></webview>
	</div>;
	// if (loggedIn && task) {
	//
	// 	if(task.type === NodeAppTasks.SCRAPE_RECENT_POST_OF_USER) {
	//
	// 	}
	//
	//
	//
	// }
	return null;
}