/* eslint-disable @typescript-eslint/no-unused-vars */
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { auth } from '@/lib/utils/auth'

export const Route = createFileRoute('/(authorized)/_auth')({
	// Before loading, authenticate the user via our auth context
	// This will also happen during prefetching (e.g. hovering over links, etc)
	beforeLoad: ({ context, location }) => {
		// we may use the session storage to store the user's session and check if the user is logged in

		// If the user is logged out, redirect them to the login page
		if (context.auth.status === 'loggedOut') {
			// uncomment the following line to redirect the user to the login page
			// throw redirect({
			// 	to: '/login',
			// 	search: {
			// 		// Use the current location to power a redirect after login
			// 		// (Do not use `router.state.resolvedLocation` as it can
			// 		// potentially lag behind the actual current location)
			// 		redirect: location.href,
			// 	},
			// })

			// remove the following lines after logging feature is implemented
			return {
				username: 'guest',
			}
		}
		// Otherwise, return the user in context
		return {
			username: auth.username,
		}
	},
	component: () => <Outlet />,
})
