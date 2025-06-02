import { SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

interface FloatingSettingsButtonProps {
	onClick: () => void
}

export const FloatingSettingsButton: React.FC<FloatingSettingsButtonProps> = ({
	onClick,
}) => {
	return (
		<Button
			variant='filled'
			color='primary'
			shape='circle'
			size='large'
			onClick={onClick}
			icon={<SettingOutlined />}
			style={{
				position: 'fixed',
				bottom: 24,
				left: 24,
				zIndex: 1000,
			}}
		/>
	)
}
