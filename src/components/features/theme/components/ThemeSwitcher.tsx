import { Select, Space, Typography } from 'antd'
import React from 'react'
import { THEME_OPTIONS } from '../utils/constants.tsx'
import { ThemeName } from '../utils/types'
import { useTheme } from '../utils/useTheme'

const { Text } = Typography

const ThemeSwitcher: React.FC = () => {
	const { currentTheme, setTheme } = useTheme()

	return (
		<Space>
			<Text>Theme:</Text>
			<Select
				value={currentTheme}
				onChange={(value: ThemeName) => setTheme(value)}
				options={THEME_OPTIONS}
				optionRender={(option) => (
					<Space>
						{option.data.icon}
						{option.data.label}
					</Space>
				)}
				style={{ width: 180 }}
			/>
		</Space>
	)
}

export default ThemeSwitcher
