import { ConfigProvider } from 'antd'
import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { themes } from '../tokens'
import { ThemeName, ThemeContextType } from '../utils/types'

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType>({
	currentTheme: 'light',
	setTheme: () => {},
	themes,
})

interface ThemeProviderProps {
	children: ReactNode
	defaultTheme?: ThemeName
}

const THEME_KEY = 'ant-theme-preference'

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	defaultTheme = 'light',
}) => {
	const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
		const savedTheme = localStorage.getItem(THEME_KEY)
		return (savedTheme as ThemeName) || defaultTheme
	})

	useEffect(() => {
		localStorage.setItem(THEME_KEY, currentTheme)
		document.documentElement.setAttribute('data-theme', currentTheme)
	}, [currentTheme])

	const setTheme = (theme: ThemeName) => {
		if (themes[theme]) {
			setCurrentTheme(theme)
		}
	}

	// Context value
	const contextValue: ThemeContextType = {
		currentTheme,
		setTheme,
		themes,
	}

	return (
		<ThemeContext.Provider value={contextValue}>
			<ConfigProvider theme={themes[currentTheme].config}>
				{children}
			</ConfigProvider>
		</ThemeContext.Provider>
	)
}
