import { useEffect, useState } from 'react';

import { Loader } from '../components/loader';
import { useToast } from '../components/ui/use-toast';
import { HashRoutes, SNAPX_URL } from '../constants';
import { linkNodeApp } from '../api/telegram';

export function Login() {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [tmaOpened, setTmaOpened] = useState(false);

	async function init() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const token = await (window as any).methods.getToken();
		if (token) {
			setLoggedIn(true);
			window.location.href = HashRoutes.HOME;
		}
	}

	useEffect(() => {
		void init();
	}, []);

	async function login() {
		try {
			setLoading(true);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const response = (await (
				window as any
			).methods.telegramLogin()) as string;

			const urlParams = new URLSearchParams(response.split('#')[1]);
			setLoggedIn(true);
			const token = urlParams.get('tgAuthResult');
			if (token) {
				(window as any).methods.setToken(token);
				await linkNodeApp();
			}
		} catch (e) {
			toast({
				description: 'Could not connect to telegram',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	}

	function openSnapxTma() {
		window.open(SNAPX_URL, '_blank');
		setTmaOpened(true);
	}

	return (
		<div className='flex flex-col w-full h-full items-center py-6 px-4 justify-between'>
			<div className='flex flex-col items-center'>
				<img
					src='static://assets/images/snapx-logo-white.svg'
					width={140}
					height={40}
					alt='snapx'
				/>
			</div>
			<div className='flex flex-col items-center'>
				<img
					src={`static://assets/icons/${loggedIn ? tmaOpened ? 'ic_check.png' : 'snapx-tma.svg' : 'ic_telegram.svg'}`}
					width={108}
					height={108}
					alt='telegram'
				/>
				<p className='mt-6 text-lg font-bold'>
					{loggedIn ? tmaOpened ? 'Telegram has been connected' :
							'Launch the SnapX App'
						: 'Connect your Telegram account'}
				</p>
			</div>
			{!loggedIn && (
				<button
					onClick={() => void login()}
					disabled={loading}
					className='w-full btn-primary tap-effect mb-[20%]'
				>
					{loading ? (
						<Loader className='fill-white' />
					) : (
						'Connect to Telegram'
					)}
				</button>
			)}
			{loggedIn && !tmaOpened && (
				<button
					onClick={openSnapxTma}
					className='w-full btn-primary tap-effect mb-[20%]'
				>
					Go to Snapx App
				</button>
			)}
			{loggedIn && tmaOpened && (
				<a
					href={HashRoutes.HOME}
					className='w-full btn-primary tap-effect mb-[20%]'
				>
					Next
				</a>
			)}
		</div>
	);
}
