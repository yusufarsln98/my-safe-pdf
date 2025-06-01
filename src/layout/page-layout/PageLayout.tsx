import { Layout, Grid } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const { Content, Sider } = Layout
const { useBreakpoint } = Grid

export const Container = styled(Layout)`
	min-height: calc(100vh - 64px);
`

export const StyledContent = styled(Content)`
	display: flex;
	flex-direction: column;
	padding: 24px;
	flex: 1;
`

export const StyledSider = styled(Sider)<{ $collapsed?: boolean }>`
	height: ${(props) => (props.$collapsed ? '0' : 'calc(100vh - 64px)')};
	background-color: ${(props) => props.theme.colorBgContainer};
	border-left: ${(props) => props.theme.colorBorder} 1px solid;
	display: flex;
	flex-direction: column;
	overflow-y: auto;

	.ant-layout-sider-zero-width-trigger {
		top: 12px;
		background: ${(props) => props.theme.colorBgContainer};
		color: ${(props) => props.theme.colorText};
		border: 1px solid ${(props) => props.theme.colorBorder};
	}
`

export const SidebarContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 8px;
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
	collapsedWidth?: number
}

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
	sider,
	siderWidth = 300,
	collapsedWidth = 0,
}) => {
	const [collapsed, setCollapsed] = useState(false)
	const screens = useBreakpoint()

	// Automatically collapse on small screens
	useEffect(() => {
		setCollapsed(!screens.md)
	}, [screens.md])

	return (
		<Container>
			<StyledContent>{children}</StyledContent>
			{sider && (
				<StyledSider
					width={siderWidth}
					collapsible
					collapsed={collapsed}
					onCollapse={setCollapsed}
					collapsedWidth={collapsedWidth}
					breakpoint='md'
					reverseArrow
					$collapsed={collapsed}
				>
					{sider}
				</StyledSider>
			)}
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
