import { darkTokens } from './dark'
import { lightTokens } from './light'
import { ThemeName, AppTheme } from '../utils/types'

export const themes: Record<ThemeName, AppTheme> = {
	light: {
		name: 'light',
		config: lightTokens,
	},
	dark: {
		name: 'dark',
		config: darkTokens,
	},
}

export { lightTokens, darkTokens }
