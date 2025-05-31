import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { ReactElement } from 'react'
import { ThemeName } from './types'

export interface ThemeOption {
	value: ThemeName
	label: string
	icon: ReactElement
}

export const THEME_OPTIONS: ThemeOption[] = [
	{ value: 'light', label: 'Light', icon: <SunOutlined /> },
	{ value: 'dark', label: 'Dark', icon: <MoonOutlined /> },
]
