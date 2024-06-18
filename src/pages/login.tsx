import { useEffect, useState } from 'react';

import { Loader } from '../components/loader';
import { useToast } from '../components/ui/use-toast';
import { HashRoutes } from '../constants';
import { linkNodeApp } from '../api/telegram';

export function Login() {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

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

	return (
		<div className="flex flex-col w-full h-full items-center py-6 px-4 justify-between">
			<div className="flex flex-col items-center">
				<img
					src="static://assets/images/snapx-logo-white.png"
					width={120}
					height={34}
					alt="snapx"
				/>
				<h1 className="font-bold text-lg mt-6">Telegram integration</h1>
			</div>
			<div className="flex flex-col items-center">
				<img
					src={`static://assets/icons/${loggedIn ? 'ic_check.png' : 'ic_telegram.svg'}`}
					width={108}
					height={18}
					alt="telegram"
				/>
				<p className="mt-6 text-lg font-bold">
					{loggedIn
						? 'Integration has been completed'
						: 'Connect your Telegram account'}
				</p>
			</div>
			{!loggedIn && (
				<button
					onClick={() => void login()}
					disabled={loading}
					className="w-full btn-primary tap-effect mb-[20%]"
				>
					{loading ? (
						<Loader className="fill-white" />
					) : (
						'Telegram integration'
					)}
				</button>
			)}{' '}
			{loggedIn && (
				<a
					href={HashRoutes.HOME}
					className="w-full btn-primary tap-effect mb-[20%]"
				>
					Next
				</a>
			)}
		</div>
	);
}
