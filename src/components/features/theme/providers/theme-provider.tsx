import { ConfigProvider } from 'antd'
import React, { createContext, useState, ReactNode, useMemo } from 'react'
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

const THEME_KEY = 'ant-theme-preference' // do not change this key

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	defaultTheme = 'light',
}) => {
	const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
		const savedTheme = localStorage.getItem(THEME_KEY)
		return (savedTheme as ThemeName) || defaultTheme
	})

	const setTheme = (theme: ThemeName) => {
		if (themes[theme]) {
			setCurrentTheme(theme)
			localStorage.setItem(THEME_KEY, theme)
		}
	}

	// Context value
	const contextValue = useMemo<ThemeContextType>(
		() => ({
			currentTheme,
			setTheme,
			themes,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentTheme, themes]
	)

	return (
		<ThemeContext.Provider value={contextValue}>
			<ConfigProvider theme={themes[currentTheme].config}>
				{children}
			</ConfigProvider>
		</ThemeContext.Provider>
	)
}
