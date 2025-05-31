// components/AppHeader.tsx
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { LanguageSwitcher } from '@/features/language-switcher'
import { ThemeSwitcher } from '@/features/theme'

const { Header } = Layout

const StyledHeader = styled(Header)`
	padding: 0;
	background-color: ${(props) => props.theme.colorBgContainer};
`

const ToggleButton = styled(Button)`
	font-size: ${(props) => props.theme.fontSizeLG}px;
	width: 36px;
	height: 36px;
	margin: 0 ${(props) => props.theme.marginMD}px;
`

interface AppHeaderProps {
	collapsed: boolean
	setCollapsed: (collapsed: boolean) => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({
	collapsed,
	setCollapsed,
}) => {
	return (
		<StyledHeader>
			<ToggleButton
				type='text'
				icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				onClick={() => setCollapsed(!collapsed)}
			/>
			<ThemeSwitcher />
			<LanguageSwitcher />
		</StyledHeader>
	)
}
