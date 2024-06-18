// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('methods', {
	telegramLogin: () => ipcRenderer.invoke('telegram-login'),
	getToken: () => ipcRenderer.invoke('get-token'),
	getUptime: () => ipcRenderer.invoke('get-uptime'),
	setToken: (token: string) => ipcRenderer.send('set-token', token),
	openTwitterAuth: () => ipcRenderer.invoke('open-twitter-auth'),
	isTwitterLoggedIn: () => ipcRenderer.invoke('is-twitter-logged-in'),
	logoutTwitter: () => ipcRenderer.invoke('logout-twitter'),
	getTwitterUsername: () => ipcRenderer.invoke('get-twitter-username'),
});
