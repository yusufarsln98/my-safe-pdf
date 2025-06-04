import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Layout, Menu, Flex, Space } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
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

const SocialIcons = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	.anticon {
		font-size: 18px;
		color: ${(props) => props.theme.colorText};
		cursor: pointer;
		transition: color 0.3s ease;
		padding: 4px;

		&:hover {
			color: ${(props) => props.theme.colorPrimary};
		}
	}
`

// Define menu items configuration

export const AppHeader: React.FC = () => {
	const { currentTheme } = useTheme()
	const { t } = useTranslation()

	const MENU_ITEMS: {
		key: string
		path: string
		label: string
	}[] = [
		{
			key: 'home',
			path: '/',
			label: t('menu.home'),
		},
		{
			key: 'merge',
			path: '/merge',
			label: t('menu.merge'),
		},
		{
			key: 'split',
			path: '/split',
			label: t('menu.split'),
		},
		{
			key: 'arrangement',
			path: '/arrangement',
			label: t('menu.arrangement'),
		},
		{
			key: 'image-to-pdf',
			path: '/image-to-pdf',
			label: t('menu.imageToPdf'),
		},
	]

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
				<SocialIcons>
					<a
						href='https://www.linkedin.com/in/yusufarsln98'
						target='_blank'
						rel='noopener noreferrer'
					>
						<LinkedinOutlined />
					</a>
					<a
						href='https://github.com/yusufarsln98/my-safe-pdf'
						target='_blank'
						rel='noopener noreferrer'
					>
						<GithubOutlined />
					</a>
				</SocialIcons>
				<ThemeSwitcher />
				<LanguageSwitcher />
			</Space>
		</StyledHeader>
	)
}
