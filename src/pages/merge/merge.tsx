import { Typography } from 'antd'
import React from 'react'

const { Title, Paragraph } = Typography

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MergeProps {}

export const Merge: React.FC<MergeProps> = () => {
	return (
		<div>
			<Title level={2}>Dashboard</Title>
			<Paragraph type='secondary'>
				Welcome to your dashboard. Here's an overview of your activity.
			</Paragraph>
		</div>
	)
}
