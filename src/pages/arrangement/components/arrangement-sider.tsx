import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Typography, Button, Flex } from 'antd'
import React from 'react'
import { SidebarLayout } from '@/layout/page-layout'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

interface ArrangementSiderProps {
	onBack: () => void
}

export const ArrangementSider: React.FC<ArrangementSiderProps> = ({
	onBack,
}) => {
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
						{t('sider.arrangement.title')}
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
				message={t('sider.arrangement.dragDropTitle')}
				description={
					<>
						{t('sider.arrangement.dragDropInstructions', {
							returnObjects: true,
						}).map((instruction, index) => (
							<React.Fragment key={index}>
								• {instruction}
								{index < 2 && <br />}
							</React.Fragment>
						))}
					</>
				}
				type='info'
				showIcon
			/>
			<Alert
				message={t('sider.arrangement.pageCountTitle')}
				description={t('sider.arrangement.pageCountDescription')}
				type='warning'
				showIcon
				style={{ marginTop: '16px' }}
			/>
		</SidebarLayout>
	)
}
