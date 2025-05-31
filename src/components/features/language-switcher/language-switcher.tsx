import React from 'react'
import styled from 'styled-components'
import { Dropdown, Button, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { ItemType } from 'antd/es/menu/interface'
import { ActiveDot } from '@/components/ui/active-dot'

const LanguageIconButton = styled(Button)`
	&:hover,
	&:focus {
		background: ${({ theme }) => theme.colorBgElevated};
	}
`

const LANGUAGE_OPTIONS = [
	{ value: 'en', label: 'English', flag: '🇺🇸' },
	{ value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
]

export const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation()

	const items: ItemType[] = LANGUAGE_OPTIONS.map((opt) => ({
		key: opt.value,
		label: (
			<Flex
				align='center'
				gap={8}
				style={{
					minWidth: 120,
				}}
			>
				<span style={{ fontSize: '16px' }}>{opt.flag}</span>
				{opt.label}
				{i18n.language === opt.value && <ActiveDot />}
			</Flex>
		),
	}))

	const currentOption = LANGUAGE_OPTIONS.find(
		(opt) => opt.value === i18n.language
	)

	return (
		<Dropdown
			menu={{
				items: items,
				onClick: (info) => i18n.changeLanguage(info.key),
			}}
			trigger={['click']}
			placement='bottomRight'
		>
			<LanguageIconButton
				aria-label='Switch language'
				type='text'
			>
				<Flex
					align='center'
					gap={4}
				>
					<span style={{ fontSize: '14px' }}>{currentOption?.flag}</span>
					<span>{currentOption?.label}</span>
				</Flex>
			</LanguageIconButton>
		</Dropdown>
	)
}
