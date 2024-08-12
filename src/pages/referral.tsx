import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import { HashRoutes } from '../constants';
import { Loader } from '../components/loader';
import { submitReferralCode } from '../api/user';

const CODE_LENGTH = 6;

export function Referral() {
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);

	async function submitCode() {
		if (loading) {
			return;
		}
		setLoading(true);
		setError(false);
		try {
			await submitReferralCode(code);
			setVerified(true);
		} catch (e) {
			setError(true);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (code.length === CODE_LENGTH) {
			void submitCode();
		} else {
			setError(false);
		}
	}, [code]);


	function goToHome() {
		window.location.href = HashRoutes.HOME;
	}

	return (
		<div className='flex flex-col w-full h-full items-center py-6 px-4 justify-between'>
			<div className='flex flex-col items-center'>
				<img
					src='static://assets/images/sela_network-logo-white.svg'
					width={140}
					height={40}
					alt='sela_network'
				/>
			</div>
			<div className='flex flex-col items-center'>
				<img
					src='static://assets/icons/ic_team_2.svg'
					width={110}
					height={100}
					alt='refer'
				/>
				<p className='mt-6 text-lg font-bold text-center'>
					Please enter your 6 digit referral code below
				</p>
				<p className='mt-1 text-hint text-sm text-center'>To sign up for the alpha version, you must enter a
					referral code</p>
				<OtpInput
					value={code}
					onChange={(code) => !loading && !verified && setCode(code.toUpperCase())}
					numInputs={CODE_LENGTH}
					containerStyle='gap-2 mt-6'
					inputStyle={`bg-[#333D4D] text-white !w-[52px] h-[61px] rounded-xlg text-bold text-2xl ${error && 'border border-destructive-alt'}`}
					renderInput={(props) => <input  {...props} />}
				/>
				<p className={`text-xs text-destructive-alt mt-2 ${!error && 'invisible'}`}>This is not a referral code. Please check
					again</p>
			</div>

			<button
				onClick={goToHome}
				disabled={!verified}
				className={`w-full btn-primary ${!verified && 'bg-[#AAAAAA]'} tap-effect mb-[20%]`}
			>
				{loading ? <Loader className='fill-white' /> : 'Go to sela_network App'}
			</button>
		</div>
	);
}
