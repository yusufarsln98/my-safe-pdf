import { ThemeConfig } from 'antd'

export type ThemeName = 'light' | 'dark' | 'light-breeze' | 'midnight-breeze'

export interface AppTheme {
	name: ThemeName
	config: ThemeConfig
}

export interface ThemeContextType {
	currentTheme: ThemeName
	setTheme: (theme: ThemeName) => void
	themes: Record<ThemeName, AppTheme>
}
