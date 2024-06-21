import { getScrapingStatsHistory, NodeAppStatsHistory } from '../api/user';
import { useEffect, useState } from 'react';
import { format } from 'date-fns/format';
import { useToast } from './ui/use-toast';
import { Loader } from './loader';

export function EarningHistory() {
	const [history, setHistory] = useState<NodeAppStatsHistory[]>([])
	const [loading, setLoading] = useState(false);
	const {toast} = useToast();


	useEffect(() => {
		(async ()=> {
			try {
				setLoading(true)
				const res = await  getScrapingStatsHistory();
				setHistory(res);
			} catch (e) {
				toast({description:'Could not fetch history'});
			} finally {
				setLoading(false)
			}
		})()
	}, []);

	return (
		<div className="flex items-center flex-col">
			<h1 className="font-bold text-lg">History</h1>
			<div className="flex flex-col bg-card py-3 px-4 mt-4 pt-10 pb-7 rounded-xlg w-full">
				<table className="text-left">
					<thead className="text-xs-l">
					<tr>
						<th scope="col">Date</th>
						<th scope="col">No of Scrapings</th>
						<th scope="col">Earnings</th>
					</tr>
					</thead>
					<tbody className="mt-2">
					{history.map((item) => (
						<tr
							key={item.date.toString()}
							className="text-xs text-left  text-hint"
						>
							<td className="px-auto py-1">
								{format(new Date(item.date), 'MMM d, yyyy') }
							</td>
							<td className="px-auto py-1">
								{item.feedCount} Feeds
							</td>
							<td className="px-auto py-1">{item.totalPoints.toFixed(2)} SP</td>
						</tr>
					))}
					</tbody>
				</table>
				{loading && (
					<div className='w-full mt-4 flex justify-center'>
						<Loader/>
					</div>
				)}
				{!loading && !history.length && <p className='text-hint mt-4 text-sm w-full text-center'>No Data</p>}
			</div>
		</div>
	)
}