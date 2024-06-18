import { ScrapingEarnings } from '../components/scraping-earnings';
import { TonConnect } from '../components/ton-connect';
import { TwitterConnect } from '../components/twitter-connect';
import { SNAPX_URL } from '../constants';

export function Home() {
	return (
		<div className="flex flex-col w-full h-full py-6 px-4">
			<div className="flex justify-center w-full">
				<img
					src="static://assets/images/snapx-logo-white.png"
					width={120}
					height={34}
					alt="snapx"
				/>
			</div>
			<div className="mt-6 w-full flex flex-col">
				<TonConnect />
			</div>
			<div className="mt-6">
				<ScrapingEarnings />
			</div>

			<div className="mt-6">
				<TwitterConnect />
			</div>

			<div className="mt-6 flex items-center flex-col">
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
							{[1, 2, 3, 4].map((item) => (
								<tr
									key={item}
									className="text-xs text-left  text-hint"
								>
									<td className="px-auto py-1">
										May 4, 2024
									</td>
									<td className="px-auto py-1">
										000,000 Feed
									</td>
									<td className="px-auto py-1">000,000 P</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<a href={SNAPX_URL} target='_blank'  className="w-full btn-primary mt-6">Launch SnapX</a>
			<br className="h-32"></br>
		</div>
	);
}
