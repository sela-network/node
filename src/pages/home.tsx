import { ScrapingEarnings } from '../components/scraping-earnings';
import { TonConnect } from '../components/ton-connect';
import { TwitterConnect } from '../components/twitter-connect';
import { HashRoutes, sela_network_URL, UPTIME_UPDATE_INTERVAL_IN_MS } from '../constants';
import { TwitterTaskRunner } from '../components/twitter-task-runner';
import { EarningHistory } from '../components/earning-history';
import { useEffect, useState } from 'react';
import { claimUptimeReward, getReferralData, getScrapingStats, NodeAppStats, ReferralData } from '../api/user';
import { Tabs, TabsContent, TabsTrigger } from '../components/ui/tabs';
import { TabsList } from '../components/ui/tabs';
import { Referral } from '../components/referral';
import { useSetTwitterLoggedIn, useTwitterLoggedIn } from '../stores/app-store';
import { differenceInMilliseconds } from 'date-fns';
import { useToast } from '../components/ui/use-toast';

const TABS = {
	MINING: 'MINING',
	REFERRAL: 'REFERRAL',
};

export function Home() {
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [selectedTab, setSelectedTab] = useState(TABS.MINING);
	const twitterLoggedIn = useTwitterLoggedIn();
	const [stats, setStats] = useState<NodeAppStats| null>({
		todayEarnings: 0,
		totalEarnings: 0,
		totalUptime: 0,
		todayUptime: 0
	})
	const [referralData, setReferralData] = useState<ReferralData | null>(null)
	const setTwitterLoggedIn =  useSetTwitterLoggedIn();
	const [lastUptimeUpdate, setLastUptimeUpdate]= useState<Date>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await getScrapingStats();
				if(!res) {
					return;
				}
				setStats(res);
			} catch {
				toast({description:'Could not load stats', variant: 'destructive'});
			}
		})()
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await getReferralData();
				if (!res.isReferred) {
					window.location.href = HashRoutes.REFERRAL;
				} else {
					setLoading(false);
					setReferralData(res);
				}
			} catch {
				toast({description:'Could not load stats', variant: 'destructive'});
			}
		})();
	}, []);

	useEffect(() => {
		if(!twitterLoggedIn) {
			return;
		}
		const unsub = setInterval(() => {
			(async () => {
				try {
					const elapsedSecondsSinceLastUpdate = lastUptimeUpdate ?  differenceInMilliseconds(new Date(), lastUptimeUpdate): UPTIME_UPDATE_INTERVAL_IN_MS;
					setLastUptimeUpdate(new Date());

					const res = await claimUptimeReward(elapsedSecondsSinceLastUpdate);
					setStats(res);
				} catch {
					toast({description:'Could not get uptime', variant: 'destructive'});
				}
			})()
		}, UPTIME_UPDATE_INTERVAL_IN_MS);

		return () => clearInterval(unsub);
	}, [twitterLoggedIn, lastUptimeUpdate]);


	async function checkTwitterLogin() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const loggedIn = (await (
			window as any
		).methods.isTwitterLoggedIn()) as boolean;

		setTwitterLoggedIn(loggedIn);
	}

	useEffect(() => {
		void checkTwitterLogin();
	}, []);


	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center w-full h-[100vh] py-6 px-4 bg-background'>
				<div className='flex justify-center w-full mb-20'>
					<img
						src='static://assets/images/sela_network-logo-white.svg'
						width={140}
						height={40}
						alt='sela_network'
					/>
				</div>
			</div>
		);
	}


	return (
		<div className='flex flex-col w-full h-full py-6 bg-background'>
			<div className='flex justify-center w-full'>
				<img
					src='static://assets/images/sela_network-logo-white.svg'
					width={140}
					height={40}
					alt='sela_network'
				/>
			</div>
			<TwitterTaskRunner />

			<Tabs value={selectedTab} onValueChange={setSelectedTab} className='w-full mt-6'>
				<TabsList>
					<TabsTrigger value={TABS.MINING}>Mining</TabsTrigger>
					<TabsTrigger value={TABS.REFERRAL}>Referral</TabsTrigger>
				</TabsList>
				<TabsContent className='px-4' value={TABS.MINING}>

					<div className='mt-6'>
						<ScrapingEarnings stats={stats}/>
					</div>

					<div className='mt-6'>
						<TwitterConnect />
					</div>


					<div className='mt-6'>
						<EarningHistory />
					</div>


					<a href={sela_network_URL} target='_blank' className='w-full btn-primary mt-10'>Launch sela_network</a>
					<div className='mt-10 w-full flex flex-col'>
						<TonConnect />
					</div>
					<br className='h-32'></br>
				</TabsContent>
				<TabsContent className='px-4' value={TABS.REFERRAL}>
					<div className='mt-6'>
						<Referral referralData={referralData} />
						<br className='h-32'></br>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
