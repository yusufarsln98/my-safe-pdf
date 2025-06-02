import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Typography, Button, Flex } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'

const { Title } = Typography

interface ArrangementSiderProps {
	onBack: () => void
}

export const ArrangementSider: React.FC<ArrangementSiderProps> = ({
	onBack,
}) => {
	return (
		<SidebarLayout
			title={
				<Flex
					align='center'
					justify='space-between'
				>
					<Title
						level={5}
						style={{ margin: 0, padding: 0 }}
					>
						Arrange PDF Pages
					</Title>
					<Button
						type='text'
						onClick={onBack}
						icon={<ArrowLeftOutlined />}
					/>
				</Flex>
			}
		>
			<Alert
				message='Drag and Drop Instructions'
				description={
					<>
						• Drag and drop pages to reorder them
						<br />
						• Click the delete icon to remove a page
						<br />• Changes will be applied when you click "Arrange Pages"
					</>
				}
				type='info'
				showIcon
			/>
			<Alert
				message='Page Count'
				description='Make sure all pages are in the desired order before arranging.'
				type='warning'
				showIcon
				style={{ marginTop: '16px' }}
			/>
		</SidebarLayout>
	)
}
