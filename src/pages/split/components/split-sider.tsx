import { ArrowLeftOutlined } from '@ant-design/icons'
import { Form, Segmented, Typography, Button, Flex, FormInstance } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomRangesForm } from './custom-ranges-form'
import { FixedRangesForm } from './fixed-ranges-form'
import { FixedSplitValue, RangeFormValue, SplitMode } from '../types'
import { SidebarContent, SidebarLayout } from '@/layout/page-layout'

const { Title, Text } = Typography

interface SplitSiderProps {
	totalPages: number
	onRangesChange: (ranges: RangeFormValue) => void
	onBack: () => void
	form: FormInstance<RangeFormValue>
}

export const SplitSider: React.FC<SplitSiderProps> = ({
	totalPages,
	onRangesChange,
	onBack,
	form,
}) => {
	const [splitMode, setSplitMode] = useState<SplitMode>('custom')
	const [fixedForm] = Form.useForm<FixedSplitValue>()
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
						{t('sider.split.title')}
					</Title>
					<Button
						type='text'
						onClick={onBack}
						icon={<ArrowLeftOutlined />}
					/>
				</Flex>
			}
		>
			<SidebarContent>
				<div style={{ marginBottom: 24 }}>
					<Text>{t('sider.split.splitMode')}</Text>
					<Segmented
						block
						options={[
							{ label: t('sider.split.customRanges'), value: 'custom' },
							{ label: t('sider.split.fixedRanges'), value: 'fixed' },
						]}
						value={splitMode}
						onChange={(value) => setSplitMode(value as SplitMode)}
						style={{ marginTop: 8 }}
					/>
				</div>
				{splitMode === 'custom' ? (
					<CustomRangesForm
						form={form}
						totalPages={totalPages}
						onValuesChange={onRangesChange}
					/>
				) : (
					<FixedRangesForm
						form={fixedForm}
						totalPages={totalPages}
						onValuesChange={onRangesChange}
					/>
				)}
			</SidebarContent>
		</SidebarLayout>
	)
}
