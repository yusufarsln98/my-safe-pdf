import { Link } from '@tanstack/react-router'
import { Layout, Menu, Flex, Space } from 'antd'
import React from 'react'
import styled from 'styled-components'
import logoDark from '@/assets/logo-dark.png'
import logo from '@/assets/logo.png'
import { LanguageSwitcher } from '@/components/features/language-switcher/language-switcher'
import { ThemeSwitcher, useTheme } from '@/components/features/theme'

const { Header } = Layout

const StyledHeader = styled(Header)`
	background-color: ${(props) => props.theme.colorBgContainer};
	box-shadow: ${(props) => props.theme.boxShadowTertiary};
	border-bottom: ${(props) => props.theme.colorBorder} 1px solid;
	z-index: 1000;
	display: flex;
	align-items: center;
	padding: 0 32px;

	.active-link {
		color: ${(props) => props.theme.colorPrimary} !important;
	}
`

// Define menu items configuration
const MENU_ITEMS: {
	key: string
	path: string // TODO: make this type safe
	label: string
}[] = [
	{
		key: 'home',
		path: '/',
		label: 'Home',
	},
	{
		key: 'merge',
		path: '/merge',
		label: 'Merge PDFs',
	},
	{
		key: 'split',
		path: '/split',
		label: 'Split PDF',
	},
]

export const AppHeader: React.FC = () => {
	const { currentTheme } = useTheme()

	// Convert menu items to Ant Design format with active state
	const menuItems = MENU_ITEMS.map((item) => ({
		key: item.key,
		label: (
			<Link
				to={item.path}
				activeProps={{ className: 'active-link' }}
				activeOptions={{ exact: true }}
				style={{ fontWeight: 500 }}
			>
				{item.label}
			</Link>
		),
	}))

	return (
		<StyledHeader>
			<Flex
				align='center'
				style={{ flex: 1, minWidth: 0 }}
			>
				<Link to='/'>
					<img
						src={currentTheme === 'dark' ? logoDark : logo}
						alt='Logo'
						style={{ height: 32, marginRight: 16, display: 'block' }}
					/>
				</Link>
				<Menu
					mode='horizontal'
					items={menuItems}
					selectable={false}
					style={{
						flex: 1,
						minWidth: 0,
						background: 'transparent',
						borderBottom: 'none',
					}}
				/>
			</Flex>
			<Space
				align='center'
				size={8}
			>
				<ThemeSwitcher />
				<LanguageSwitcher />
			</Space>
		</StyledHeader>
	)
}
