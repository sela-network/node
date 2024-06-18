import {
	TonConnectButton,
	useTonConnectModal,
	useTonWallet,
} from '@tonconnect/ui-react';
import { ChevronRightIcon } from 'lucide-react';

export function TonConnect() {
	const { open } = useTonConnectModal();
	const wallet = useTonWallet();

	return (
		<button
			className={`rounded-xlg py-3.5 px-4 bg-card flex items-center justify-center ${!wallet && 'tap-effect'}`}
			onClick={() => (!wallet ? open() : undefined)}
		>
			<img
				src="static://assets/icons/ic_wallet.png"
				width={30}
				height={30}
				alt="wallet connect"
			/>
			{!wallet && (
				<>
					<p className="ml-2 text-base-lg">Connect Wallet</p>

					<ChevronRightIcon className="ml-auto text-[#677280]" />
				</>
			)}

			{wallet && (
				<>
					<p className="ml-2 mr-auto text-base-lg">Connected</p>

					<TonConnectButton />
				</>
			)}
		</button>
	);
}
