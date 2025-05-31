import { createRouter, ErrorComponent } from '@tanstack/react-router'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { routeTree } from './routeTree.gen.ts'

import './lib/utils/i18n.ts'
import './styles/index.css'

const router = createRouter({
	routeTree: routeTree,
	defaultPendingComponent: () => <div></div>,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	defaultPreload: 'intent',
	scrollRestoration: true,
	context: {
		auth: undefined!, // We'll inject this when we render
	},
})

export type MainRouter = typeof router
declare module '@tanstack/react-router' {
	interface Register {
		router: MainRouter
	}
}

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<React.Suspense fallback='loading'>
			<App router={router} />
		</React.Suspense>
	</React.StrictMode>
)
