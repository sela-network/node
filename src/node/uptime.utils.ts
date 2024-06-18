import { APP_UPTIME_KEY } from '../constants';
import { localStore } from './store';

export function getAppUptime(): number {
	// @ts-expect-error false alarm
	return localStore.get(APP_UPTIME_KEY) || 0;
}

function setAppUptime(time: number) {
	// @ts-expect-error false alarm
	return localStore.set(APP_UPTIME_KEY, time);
}
let currentUptime = getAppUptime();
let currentSessionUptime = 0;

let counterInit = false;
export function initialiseUptimeCounter() {
	return setInterval(() => {
		currentUptime += 10;
		currentSessionUptime += 10;
		setAppUptime(currentUptime);
	}, 10000);
}

export function getAppUptimeCounters() {
	if (!counterInit) {
		counterInit = true;
		initialiseUptimeCounter();
	}

	return {
		currentUptime,
		currentSessionUptime,
	};
}
