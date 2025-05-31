import {
	UserOutlined,
	VideoCameraOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { Sider } = Layout

const StyledSider = styled(Sider)<{ $isDragging: boolean }>`
	position: relative;
	height: 100vh;
	position: sticky;
	inset-inline-start: 0;
	top: 0;
	bottom: 0;
	scrollbar-width: thin;
	scrollbar-gutter: 0;
	border-right: 1px solid ${(props) => props.theme.colorBorder};
	transition: ${(props) =>
		props.$isDragging ? 'none !important' : 'all 0.2s'};
	background-color: ${(props) => props.theme.colorBgContainer};
`

const ResizeHandle = styled.div<{ $width: number }>`
	position: absolute;
	top: 0;
	right: 0;
	width: ${(props) => props.$width}px;
	height: 100%;
	background: transparent;
	cursor: ew-resize;
	z-index: 100;

	&:hover {
		background: ${(props) => props.theme.colorPrimary};
		opacity: 0.2;
	}
`

interface ResizableSidebarProps {
	collapsed: boolean
	siderWidth: number
	isDragging: boolean
	startResizing: (e: React.MouseEvent) => void
	collapsedWidth?: number
	handleWidth?: number
}

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
	collapsed,
	siderWidth,
	isDragging,
	startResizing,
	collapsedWidth = 0,
	handleWidth = 3,
}) => {
	return (
		<StyledSider
			trigger={null}
			collapsible
			collapsed={collapsed}
			collapsedWidth={collapsedWidth}
			width={siderWidth}
			$isDragging={isDragging}
		>
			<SidebarMenu />
			{!collapsed && (
				<ResizeHandle
					$width={handleWidth}
					onMouseDown={startResizing}
				/>
			)}
		</StyledSider>
	)
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SidebarMenuProps {}

const SidebarMenu: React.FC<SidebarMenuProps> = () => {
	return (
		<Menu
			mode='inline'
			defaultSelectedKeys={['1']}
			style={{
				height: '100vh',
				border: 'none',
				overflowY: 'auto',
				scrollbarWidth: 'thin',
				scrollbarGutter: 'stable',
			}}
			items={[
				{
					key: '1',
					icon: <UserOutlined />,
					label: 'nav 1',
					children: [
						{
							key: '1-1',
							icon: <UserOutlined />,
							label: 'nav 1-1',
						},
						{
							key: '1-2',
							icon: <UserOutlined />,
							label: 'nav 1-2',
						},
					],
				},
				{
					key: '2',
					icon: <VideoCameraOutlined />,
					label: 'nav 2',
					children: [
						{
							key: '2-1',
							icon: <UserOutlined />,
							label: 'nav 2-1',
						},
						{
							key: '2-2',
							icon: <UserOutlined />,
							label: 'nav 2-2',
						},
					],
				},
				{
					key: '3',
					icon: <UploadOutlined />,
					label: 'nav 3',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '4',
					icon: <UserOutlined />,
					label: 'nav 4',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '5',
					icon: <VideoCameraOutlined />,
					label: 'nav 5',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '6',
					icon: <UploadOutlined />,
					label: 'nav 6',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '7',
					icon: <UserOutlined />,
					label: 'nav 7',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '8',
					icon: <VideoCameraOutlined />,
					label: 'nav 8',
					children: [
						{
							key: '3-1',
							icon: <UserOutlined />,
							label: 'nav 3-1',
						},
						{
							key: '3-2',
							icon: <UserOutlined />,
							label: 'nav 3-2',
						},
					],
				},
				{
					key: '9',
					icon: <UploadOutlined />,
					label: 'nav 9',
				},
				{
					key: '10',
					icon: <UserOutlined />,
					label: 'nav 10',
				},
			]}
		/>
	)
}
