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

	return (
		<div className="flex items-center flex-col">
			<h1 className="text-sm text-hint self-start">Connect Account</h1>
			<div className="flex flex-col bg-card py-6 px-4 mt-2 rounded-xlg w-full">
				<div className="flex items-center text-base-lg">
					<img
						src="static://assets/icons/logo_x.png"
						width={40}
						height={40}
						alt="wallet connect"
					/>
					<p className="mx-2 text-sm text-white">
						{username ? `@${username}` : 'Connect to X'}
					</p>
					<p
						className={`ml-auto font-bold text-sm ${twitterLoggedIn ? 'text-cyan': 'text-destructive-alt'}`}
					>
						• {twitterLoggedIn ? 'Connected' : 'Not connected'}
					</p>
				</div>

				{!connecting && (
					<button
						className={`mt-6 ${twitterLoggedIn ? 'bg-destructive-alt': 'bg-cyan'} border-none text-lg btn-secondary text-white rounded-md-sm self-center tap-effect`}
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
