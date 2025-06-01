import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { App as AntdApp } from 'antd'
import React from 'react'
import { auth } from './lib/utils/auth'
import type { MainRouter } from './main'
import { ThemeConfigProvider, ThemeProvider } from '@/components/features/theme'

const queryClient = new QueryClient()

type AppProps = { router: MainRouter }

const App: React.FC<AppProps> = ({ router }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ThemeConfigProvider>
					<AntdApp>
						<RouterProvider
							router={router}
							context={{
								auth: auth,
							}}
						/>
					</AntdApp>
				</ThemeConfigProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
