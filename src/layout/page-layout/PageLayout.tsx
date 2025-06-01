import { Layout } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { Content, Sider } = Layout

export const Container = styled(Layout)`
	min-height: calc(100vh - 64px);
`

export const StyledContent = styled(Content)`
	display: flex;
	flex-direction: column;
	padding: 24px;
	flex: 1;
`

export const StyledSider = styled(Sider)`
	min-height: calc(100vh - 64px);
	background-color: ${(props) => props.theme.colorBgContainer};
	border-left: ${(props) => props.theme.colorBorder} 1px solid;
	display: flex;
	flex-direction: column;
`

export const SidebarContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
	flex: 1;
`

export const SidebarTitleContainer = styled.div`
	border-bottom: ${(props) => props.theme.colorBorder} 1px solid;
	padding: 16px;
`

export interface PageLayoutProps {
	children: React.ReactNode
	sider?: React.ReactNode
	siderWidth?: number
}

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
	sider,
	siderWidth = 300,
}) => {
	return (
		<Container>
			<StyledContent>{children}</StyledContent>
			{sider && <StyledSider width={siderWidth}>{sider}</StyledSider>}
		</Container>
	)
}

export const SidebarLayout: React.FC<{
	title?: React.ReactNode
	children: React.ReactNode
}> = ({ title, children }) => {
	return (
		<>
			{title && <SidebarTitleContainer>{title}</SidebarTitleContainer>}
			<SidebarContent>{children}</SidebarContent>
		</>
	)
}
