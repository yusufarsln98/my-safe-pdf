import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const StyledButton = styled.button`
	padding: 0.5rem 1rem;
	background-color: #3b82f6;
	color: white;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	transition: background-color 0.2s;

	&:hover {
		background-color: #2563eb;
	}
`

export const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation()

	const toggleLanguage = () => {
		const newLang = i18n.language === 'en' ? 'tr' : 'en'
		i18n.changeLanguage(newLang)
	}

	return (
		<StyledButton onClick={toggleLanguage}>
			{i18n.language === 'en' ? 'Değiştir' : 'Switch'}
		</StyledButton>
	)
}
