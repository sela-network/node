import { claimReferralPoints, getReferralPoints, ReferralData } from '../api/user';
import { useToast } from './ui/use-toast';
import { NODE_APP_SHARE_LINK, REWARD_UPDATE_INTERVAL_IN_MS } from '../constants';
import { useEffect, useState } from 'react';
import { Loader } from './loader';

export function Referral({ referralData }: { referralData: ReferralData }) {
	const { toast } = useToast();
	const [reward, setReward] = useState(0);
	const [referralCount, setReferralCount] = useState(referralData.referrerCount || 0);
	const [loading, setLoading] = useState(false);

	const canClaim = reward > 0;

	function copyReferralLink() {
		try {
			if (!referralData?.referralCode) {
				return;
			}
			(window as any).methods.copyToClipboard(referralData.referralCode);
			toast({ description: 'Copied to clipboard' });
		} catch {
			toast({ description: 'Could not copy', variant: 'destructive' });
		}
	}

	function shareDownloadLink() {
		(window as any).methods.copyToClipboard(NODE_APP_SHARE_LINK);
		toast({ description: 'Copied share link to clipboard' });
	}

	async function updatePoints() {
		try {
			const { points, referralCount } = await getReferralPoints();
			setReward(points);
			setReferralCount(referralCount);

		} catch {
			toast({ description: 'Unable to get referral points', variant: 'destructive' });
		}

	}

	useEffect(() => {
		void updatePoints();

		const unsub = setInterval(() => {
			(async () => {
				await updatePoints();
			})();
		}, REWARD_UPDATE_INTERVAL_IN_MS);


		return () => clearInterval(unsub);
	}, []);


	async function claimPoints() {
		if (loading) {
			return;
		}
		setLoading(true);
		try {
			await claimReferralPoints();
			setReward(0);
			toast({ description: 'Successfully claimed points' });
		} catch {
			toast({ description: 'Could not claim, try later', variant: 'destructive' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<div className='text-center'>
				<h2 className='text-lg font-bold px-1'>Refer your friends</h2>
				<p className='text-sm mt-5'>Share the link with your friends on X (Twitter) or any other social
					platform.</p>
				<p className='text-sm mt-4 px-4'>When they join and receive rewards through the app, you’ll earn an
					additional 5% of their rewards.</p>
				<p className='text-sm mt-4'>Don’t forget to “Claim” your rewards and invite more friends!</p>
			</div>

			<div className='flex flex-col bg-card py-6 px-4 rounded-xlg mt-10 w-full'>
				<p className='text-sm'>Referrals</p>
				<div className='mt-1 bg-secondary px-4 py-3.5 rounded-xlg flex'>
					<img
						src='static://assets/icons/ic_team_2_white.svg'
						width={23}
						height={21}
						alt='people'
					/>
					<p className='font-medium text-2xl ml-auto'>
						{referralCount || 0}
					</p>
				</div>

				<p className='text-sm mt-6'>Referral Reward</p>
				<div className='mt-1 bg-secondary px-4 py-3.5 rounded-xlg flex'>
					<img
						src='static://assets/icons/ic_reward.svg'
						width={21}
						height={21}
						alt='reward'
					/>
					<p className='font-medium text-2xl ml-auto'>
						+ {reward} SP
					</p>
				</div>

				<button onClick={claimPoints} disabled={!canClaim}
						className={`text-lg font-bold ${canClaim ? 'bg-green' : 'bg-[#AAAAAA]'} py-1 px-10 tap-effect rounded-md-sm mt-[18px] mx-auto`}>
					{loading ? <Loader className='fill-white w-6 h-6' /> : 'Claim'}
				</button>
			</div>

			<div className='mt-6 flex items-center p-4 border-[2px] border-button rounded-xlg'>
				<p className='text-sm font-bold'>Your referral code</p>

				<button onClick={copyReferralLink}
						className='tap-effect flex gap-4 ml-auto text-lg font-bold tracking-widest '>
					{referralData?.referralCode}
					<img
						src='static://assets/icons/ic_copy.svg'
						width={20}
						height={20}
						className='mt-1'
						alt='people'
					/>
				</button>
			</div>

			<button onClick={shareDownloadLink} className='mt-4 w-full btn-primary tap-effect'>Share download link
			</button>

		</div>
	);
}
