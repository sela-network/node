import { ScrapingEarnings } from '../components/scraping-earnings';
import { TonConnect } from '../components/ton-connect';
import { TwitterConnect } from '../components/twitter-connect';
import { SNAPX_URL } from '../constants';
import { TwitterTaskRunner } from '../components/twitter-task-runner';
import { EarningHistory } from '../components/earning-history';

export function Home() {
	return (
		<div className='flex flex-col w-full h-full py-6 px-4 bg-background'>
			<div className='flex justify-center w-full'>
				<img
					src='static://assets/images/snapx-logo-white.png'
					width={120}
					height={34}
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
