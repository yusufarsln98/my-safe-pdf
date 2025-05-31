import { BulbOutlined, BulbFilled } from '@ant-design/icons'
import React, { ReactElement } from 'react'
import { ThemeName } from './types'

export interface ThemeOption {
	value: ThemeName
	label: string
	icon: ReactElement
}

export const THEME_OPTIONS: ThemeOption[] = [
	{ value: 'light', label: 'Light', icon: <BulbOutlined /> },
	{ value: 'dark', label: 'Dark', icon: <BulbFilled /> },
]
