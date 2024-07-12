import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
const CopyWebpackPlugin = require('copy-webpack-plugin');
// import { sentryWebpackPlugin } from "@sentry/webpack-plugin";


const assets = ['assets'];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure',
	}),
	new CopyWebpackPlugin({
		patterns: assets.map((asset) => ({
			from: path.resolve(__dirname, 'src', asset),
			to: path.resolve(__dirname, '.webpack/renderer', asset),
		})),
	}),
	// sentryWebpackPlugin({
	// 	authToken: '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',
	// 	org: "snapx",
	// 	project: "node-app",
	// })
];
