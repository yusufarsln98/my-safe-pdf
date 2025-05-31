import { useRouter } from '@tanstack/react-router'
import { Layout } from 'antd'
import { useLayoutEffect } from 'react'
import styled from 'styled-components'
import { LoginForm } from '@/features/login-form'
import { Route } from '@/routes/(unauthorized)/login'

const { Content } = Layout

const LoginContainer = styled(Content)`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: ${(props) => props.theme.colorBgLayout};
`

export const Login: React.FC = () => {
	const router = useRouter()
	const { auth, status } = Route.useRouteContext({
		select: ({ auth }) => ({ auth, status: auth.status }),
	})
	const search = Route.useSearch()
	const currentPath = router.history.location.pathname

	useLayoutEffect(() => {
		if (status === 'loggedIn') {
			if (currentPath === '/login') {
				router.history.push('/')
			} else if (search.redirect) {
				router.history.push(search.redirect)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, search.redirect])

	return (
		<LoginContainer>
			<LoginForm
				onSubmit={async (values) => {
					auth.login(values.email)
					await router.invalidate()
				}}
			/>
		</LoginContainer>
	)
}
