import { BulbOutlined, BulbFilled } from '@ant-design/icons'
import { Select, Space, Typography } from 'antd'
import React, { ReactElement } from 'react'
import { ThemeName } from '../utils/types'
import { useTheme } from '../utils/useTheme'

type Options = {
	value: ThemeName
	label: string
	icon: ReactElement
}[]

const { Text } = Typography

const ThemeSwitcher: React.FC = () => {
	const { currentTheme, setTheme } = useTheme()

	const options: Options = [
		{ value: 'light', label: 'Light', icon: <BulbOutlined /> },
		{ value: 'dark', label: 'Dark', icon: <BulbFilled /> },
		{ value: 'light-breeze', label: 'Light Breeze', icon: <BulbOutlined /> },
		{
			value: 'midnight-breeze',
			label: 'Midnight Breeze',
			icon: <BulbFilled />,
		},
	]

	return (
		<Space>
			<Text>Theme:</Text>
			<Select
				value={currentTheme}
				onChange={(value: ThemeName) => setTheme(value)}
				options={options}
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
