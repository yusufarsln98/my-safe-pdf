import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Typography, Button, Flex } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

interface MergeSiderProps {
	onBack: () => void
}

export const MergeSider: React.FC<MergeSiderProps> = ({ onBack }) => {
	const { t } = useTranslation()

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
						{t('sider.merge.title')}
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
				message={t('sider.merge.info')}
				type='info'
			/>
		</SidebarLayout>
	)
}
