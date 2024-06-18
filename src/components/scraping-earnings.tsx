import { Duration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

export function ScrapingEarnings() {
	const [sessionUptime, setSessionUptime] = useState(0);
	const [appUptime, setAppUptime] = useState(0);

	async function updateUptime() {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const response = (await (window as any).methods.getUptime()) as {
				currentUptime: number;
				currentSessionUptime: number;
			};

			if (!response) {
				return;
			}

			setSessionUptime(response.currentSessionUptime);
			setAppUptime(response.currentUptime);
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		setInterval(() => {
			void updateUptime();
		}, 5000);

		void updateUptime();
	}, []);

	const appUptimeDuration = intervalToDuration({
		start: 0,
		end: appUptime * 1000,
	});
	const sessionUptimeDuration = intervalToDuration({
		start: 0,
		end: sessionUptime * 1000,
	});

	function formatDuration(duration: Duration) {
		return `${duration.days || 0} Days, ${duration.hours || 0} Hrs, ${duration.minutes || 0} Mins`;
	}

	return (
		<div className="flex items-center flex-col">
			<h1 className="font-bold text-lg">Data Scraping Earnings</h1>
			<div className="bg-card py-6 px-5 rounded-xlg mt-4 w-full">
				<p className="text-base-lg">Total Earnings</p>
				<div className="mt-2 bg-secondary py-1 rounded-xlg">
					<p className="font-bold text-3.5xl text-center">
						+000,000,000
					</p>
				</div>
				<p className="text-xs-l text-hint mt-1">
					Uptime: {formatDuration(appUptimeDuration)}
				</p>

				<p className="text-base-lg mt-6">Today's Earnings</p>
				<div className="mt-2 bg-secondary py-1 rounded-xlg">
					<p className="font-bold text-3.5xl text-center">
						+000,000,000
					</p>
				</div>
				<p className="text-xs-l text-hint mt-1">
					Uptime: {formatDuration(sessionUptimeDuration)}
				</p>
			</div>
		</div>
	);
}
