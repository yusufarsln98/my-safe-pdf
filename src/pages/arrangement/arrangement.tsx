import { Flex } from 'antd'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ArrangeProps {}

export const Arrangement: React.FC<ArrangeProps> = () => {
	return (
		<Flex
			vertical
			gap={64}
			style={{ padding: '24px' }}
		>
			Arrangement Page
		</Flex>
	)
}
