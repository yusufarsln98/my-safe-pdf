// components/AppHeader.tsx
import { Layout } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { LanguageSwitcher } from '@/components/features/language-switcher'
import { ThemeSwitcher } from '@/components/features/theme'

const { Header } = Layout

const StyledHeader = styled(Header)`
	background-color: ${(props) => props.theme.colorBgContainer};
`

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppHeaderProps {}

export const AppHeader: React.FC<AppHeaderProps> = () => {
	return (
		<StyledHeader>
			<ThemeSwitcher />
			<LanguageSwitcher />
		</StyledHeader>
	)
}
