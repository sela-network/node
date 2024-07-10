import { Duration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';
import { claimUptimeReward, getScrapingStats, NodeAppStats } from '../api/user';
import { UPTIME_UPDATE_INTERVAL_IN_MS } from '../constants';
import { useTwitterLoggedIn } from '../stores/app-store';

export function ScrapingEarnings({stats}:{stats:NodeAppStats}) {
	const appUptimeDuration = intervalToDuration({
		start: 0,
		end: stats.totalUptime * 1000,
	});
	const sessionUptimeDuration = intervalToDuration({
		start: 0,
		end: stats.todayUptime * 1000,
	});

	function formatDuration(duration: Duration) {
		return `${duration.days || 0} Days, ${duration.hours || 0} Hrs, ${duration.minutes || 0} Mins`;
	}

	return (
		<div className="flex items-center flex-col">
			<h1 className="text-sm text-hint self-start">Social Mining</h1>
			<div className="bg-card py-6 px-4 rounded-xlg mt-2 w-full">
				<p className="text-sm">Total Earnings</p>
				<div className="mt-1 bg-secondary py-3.5 rounded-xlg">
					<p className="font-medium text-2xl text-center">
						+ {stats.totalEarnings.toFixed(2)} SP
					</p>
				</div>
				<p className="text-xs text-hint mt-1">
					Uptime: {formatDuration(appUptimeDuration)}
				</p>

				<p className="text-sm mt-6">Today's Earnings</p>
				<div className="mt-1 bg-secondary py-3.5 rounded-xlg">
					<p className="font-medium text-2xl text-center">
 						+ {stats.todayEarnings.toFixed(2)} SP
					</p>
				</div>
				<p className="text-xs text-hint mt-1">
					Uptime: {formatDuration(sessionUptimeDuration)}
				</p>
			</div>
		</div>
	);
}
