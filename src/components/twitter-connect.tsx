import { useEffect, useState } from 'react';

import {
	getTwitterUsername,
	initiateTwitterAuth,
	logoutTwitter,
} from '../lib/native.utils';
import { Loader } from './loader';
import { useToast } from './ui/use-toast';
import { useSetTwitterLoggedIn, useTwitterLoggedIn } from '../stores/app-store';

export function TwitterConnect() {
	const { toast } = useToast();

	const [connecting, setConnecting] = useState(false);
	const [username, setUsername] = useState('');
	const twitterLoggedIn = useTwitterLoggedIn();
	const setTwitterLoggedIn =  useSetTwitterLoggedIn();

	async function openTwitterAuth() {
		try {
			setConnecting(true);
			const loggedIn = await initiateTwitterAuth();
			setTwitterLoggedIn(loggedIn);
			if (!loggedIn) {
				toast({
					description: 'Could not connect to account',
					variant: 'destructive',
				});
			} else {
				toast({
					description: 'Connected',
				});
			}
		} catch (e) {
			toast({
				description: 'Could not connect to account',
				variant: 'destructive',
			});
		} finally {
			setConnecting(false);
		}
	}

	useEffect(() => {
		if (twitterLoggedIn) {
			void getTwitterUsername()
				.then(setUsername)
				.catch(() => {});
		}
	}, [twitterLoggedIn]);

	function disconnectTwitter() {
		void logoutTwitter();
		setTwitterLoggedIn(false);
		setUsername('');
	}

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

	return (
		<div className="flex items-center flex-col">
			<h1 className="font-bold text-lg">Account Connect</h1>
			<div className="flex flex-col bg-card py-6 px-4 mt-4 pt-10 pb-[18px] rounded-xlg w-full">
				<div className="flex items-center text-base-lg text-hint">
					<img
						src="static://assets/icons/logo_x.png"
						width={40}
						height={40}
						alt="wallet connect"
					/>
					<p className="mx-2">
						{username ? `@${username}` : 'Connect your account'}
					</p>
					<p
						className={`ml-auto font-bold ${twitterLoggedIn && 'text-green'}`}
					>
						• {twitterLoggedIn ? 'Connected' : 'Unconnected'}
					</p>
				</div>

				{!connecting && (
					<button
						className={`mt-7 ${twitterLoggedIn && 'text-destructive border-destructive'} btn-secondary self-center tap-effect`}
						onClick={() =>
							twitterLoggedIn
								? disconnectTwitter()
								: void openTwitterAuth()
						}
					>
						{twitterLoggedIn ? 'Disconnect' : 'Connect'}
					</button>
				)}

				{connecting && (
					<div className="self-center mt-7">
						<Loader />
					</div>
				)}
			</div>
		</div>
	);
}
