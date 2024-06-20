import { BrowserWindow } from 'electron';

import { TOKEN_KEY } from '../constants';
import { TELEGRAM_BOT_URL } from './node.constants';
import { localStore } from './store';

export async function telegramLogin() {
	return new Promise((resolve, reject) => {
		let authWindow = new BrowserWindow({
			width: 640,
			height: 480,
		});

		const authUrl = `https://oauth.telegram.org/auth?bot_id=7138008894&origin=${TELEGRAM_BOT_URL}/en/auth/telegram`;
		// const authUrl = `https://oauth.telegram.org`;
		void authWindow.loadURL(authUrl);
		authWindow.webContents.on('will-navigate', function (event, newUrl) {
			console.log('new url ', newUrl)

			if(newUrl === authUrl) {
				return;
			} else if(newUrl.includes('tgAuthResult')) {
				console.log('got auth result');
				authWindow.close();
				authWindow = null;
				resolve(newUrl);
			}

		});

		authWindow.on('closed', function () {
			authWindow = null;
			reject();
		});
	});
}

export function getAuthToken() {
	// @ts-expect-error false alarm
	return localStore.get(TOKEN_KEY);
}

export function setAuthToken(_: Electron.IpcMainEvent, token: string) {
	// @ts-expect-error false alarm
	localStore.set(TOKEN_KEY, token);
}
