import { Alert, Typography, Button, Space } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'

const { Title } = Typography

interface MergeSiderProps {
	onClear: () => void
}

export const MergeSider: React.FC<MergeSiderProps> = ({ onClear }) => {
	return (
		<SidebarLayout
			title={
				<Space align='center'>
					<Title
						level={5}
						style={{ margin: 0, padding: 0 }}
					>
						Merge PDFs
					</Title>
					<Button
						type='text'
						size='small'
						onClick={onClear}
					>
						Clear
					</Button>
				</Space>
			}
		>
			<Alert
				message="Click 'Select PDF files' button again to select multiple PDF files. Hold 'Ctrl' key to select multiple files."
				type='info'
			/>
		</SidebarLayout>
	)
}
