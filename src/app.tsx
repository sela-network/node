import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import { ROUTES, TON_MANIFEST_URL } from './constants';
import ErrorPage from './pages/error-page';
import { Home } from './pages/home';
import { Login } from './pages/login';

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
]);

const root = createRoot(appContainer);
root.render(
	<React.StrictMode>
		<TonConnectUIProvider manifestUrl={TON_MANIFEST_URL}>
			<RouterProvider router={router} />
		</TonConnectUIProvider>
		<Toaster />
	</React.StrictMode>,
);
