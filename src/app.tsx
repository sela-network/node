import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
	createHashRouter,
	createRoutesFromChildren, matchRoutes,
	RouterProvider,
	useLocation,
	useNavigationType,
} from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import { ROUTES, SENTRY_DSN, TON_MANIFEST_URL } from './constants';
import ErrorPage from './pages/error-page';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Referral } from './pages/referral';
import * as Sentry from "@sentry/react";

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [
		Sentry.reactRouterV6BrowserTracingIntegration({
			useEffect,
			useLocation,
			useNavigationType,
			createRoutesFromChildren,
			matchRoutes,
		}),
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
	// Capture Replay for 10% of all sessions,
	// plus for 100% of sessions with an error
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
});

const appContainer = document.getElementById('react-container');

const router = createHashRouter([
	{
		path: ROUTES.LOGIN,
		element: <Login />,
		errorElement: <ErrorPage />,
	},
	{
		path: ROUTES.HOME,
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: ROUTES.REFERRAL,
		element: <Referral />,
		errorElement: <ErrorPage />,
	},
]);

const root = createRoot(appContainer);
root.render(
	<>
		<TonConnectUIProvider manifestUrl={TON_MANIFEST_URL}>
			<RouterProvider router={router} />
		</TonConnectUIProvider>
		<Toaster />
	</>,
);
