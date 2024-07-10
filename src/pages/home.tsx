import { ScrapingEarnings } from '../components/scraping-earnings';
import { TonConnect } from '../components/ton-connect';
import { TwitterConnect } from '../components/twitter-connect';
import { HashRoutes, SNAPX_URL } from '../constants';
import { TwitterTaskRunner } from '../components/twitter-task-runner';
import { EarningHistory } from '../components/earning-history';
import { useEffect, useState } from 'react';
import { getReferralData } from '../api/user';

export function Home() {
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		(async () => {
			const res = await getReferralData();
			if (!res.isReferred) {
				window.location.href = HashRoutes.REFERRAL;
			} else {
				setLoading(false);
			}
		})();
	}, []);


	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center w-full h-[100vh] py-6 px-4 bg-background'>
				<div className='flex justify-center w-full mb-20'>
					<img
						src='static://assets/images/snapx-logo-white.svg'
						width={140}
						height={40}
						alt='snapx'
					/>
				</div>
			</div>
		);
	}


	return (
		<div className='flex flex-col w-full h-full py-6 px-4 bg-background'>
			<div className='flex justify-center w-full'>
				<img
					src='static://assets/images/snapx-logo-white.svg'
					width={140}
					height={40}
					alt='snapx'
				/>
			</div>
			<div className='mt-6 w-full flex flex-col'>
				<TonConnect />
			</div>
			<div className='mt-6'>
				<ScrapingEarnings />
			</div>

			<div className='mt-6'>
				<TwitterConnect />
			</div>

			<TwitterTaskRunner />

			<div className='mt-6'>
				<EarningHistory />
			</div>


			<a href={SNAPX_URL} target='_blank' className='w-full btn-primary mt-6'>Launch SnapX</a>
			<br className='h-32'></br>
		</div>
	);
}
