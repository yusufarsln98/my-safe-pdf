import { Alert, Typography } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'

const { Title, Text } = Typography

export const ArrangementSider: React.FC = () => {
	return (
		<SidebarLayout
			title={
				<Title
					level={5}
					style={{ margin: 0, padding: 0 }}
				>
					Arrange PDF Pages
				</Title>
			}
		>
			<Alert
				message='Drag and Drop Instructions'
				description={
					<>
						<Text>
							• Drag and drop pages to reorder them
							<br />
							• Click the delete icon to remove a page
							<br />• Changes will be applied when you click "Arrange Pages"
						</Text>
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
			/>
		</SidebarLayout>
	)
}
