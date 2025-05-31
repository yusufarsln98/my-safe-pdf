import { Layout } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { AppHeader } from './app-header'

const { Content } = Layout

const StyledContent = styled(Content)`
	padding: 24px;
	margin: 0;
	min-height: 280px;
`

interface HomeLayoutProps {
	children: React.ReactNode
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
	return (
		<Layout>
			<Layout
				style={{ minHeight: '100vh' }}
				hasSider={true}
			>
				<Layout>
					<AppHeader />
					<StyledContent>{children}</StyledContent>
				</Layout>
			</Layout>
		</Layout>
	)
}
