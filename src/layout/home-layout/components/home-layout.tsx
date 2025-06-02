import { Layout } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { AppHeader } from './app-header'

const { Content, Footer } = Layout

const StyledContent = styled(Content)`
	margin: 0;
	min-height: 280px;
`

const StyledFooter = styled(Footer)`
	background: ${(props) => props.theme.colorBgContainer};
	text-align: center;
	padding: 20px 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
	border-top: 1px solid ${(props) => props.theme.colorBorder};
`

const FooterText = styled.span`
	font-size: 14px;
	color: ${(props) => props.theme.colorText};
	font-weight: 500;
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
					<StyledFooter>
						<FooterText>© My Safe PDF - {new Date().getFullYear()}</FooterText>
					</StyledFooter>
				</Layout>
			</Layout>
		</Layout>
	)
}
