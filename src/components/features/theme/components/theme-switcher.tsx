import { Dropdown, Button, Flex } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import React from 'react'
import styled from 'styled-components'
import { THEME_OPTIONS } from '../utils/constants'
import { ThemeName } from '../utils/types'
import { useTheme } from '../utils/useTheme'
import { ActiveDot } from '@/components/ui/active-dot'

const ThemeIconButton = styled(Button)`
	&:hover,
	&:focus {
		background: ${({ theme }) => theme.colorBgElevated};
	}
`

export const ThemeSwitcher: React.FC = () => {
	const { currentTheme, setTheme } = useTheme()

	const items: ItemType[] = THEME_OPTIONS.map((opt) => ({
		key: opt.value,
		icon: opt.icon,
		label: (
			<Flex
				align='center'
				gap={8}
				style={{
					minWidth: 72,
				}}
			>
				{opt.label}
				{currentTheme === opt.value && <ActiveDot />}
			</Flex>
		),
	}))

	const currentOption = THEME_OPTIONS.find((opt) => opt.value === currentTheme)

	return (
		<Dropdown
			menu={{
				items: items,
				onClick: (info) => setTheme(info.key as ThemeName),
			}}
			trigger={['click']}
			placement='bottomLeft'
		>
			<ThemeIconButton
				aria-label='Switch theme'
				type='text'
				icon={currentOption?.icon}
			/>
		</Dropdown>
	)
}
