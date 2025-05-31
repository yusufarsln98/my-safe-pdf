import { darkTokens } from './dark'
import { lightTokens } from './light'
import { lightBreezeTokens } from './lightBreeze'
import { midnightBreezeTokens } from './midnightBreeze'
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
	'light-breeze': {
		name: 'light-breeze',
		config: lightBreezeTokens,
	},
	'midnight-breeze': {
		name: 'midnight-breeze',
		config: midnightBreezeTokens,
	},
}

export { lightTokens, darkTokens, lightBreezeTokens, midnightBreezeTokens }
