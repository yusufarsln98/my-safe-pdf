import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Typography, Button, Flex } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'

const { Title } = Typography

interface MergeSiderProps {
	onBack: () => void
}

export const MergeSider: React.FC<MergeSiderProps> = ({ onBack }) => {
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
						Merge PDFs
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
				message="Click 'Select PDF files' button again to select multiple PDF files. Hold 'Ctrl' key to select multiple files."
				type='info'
			/>
		</SidebarLayout>
	)
}
