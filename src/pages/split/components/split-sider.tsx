import { ArrowLeftOutlined } from '@ant-design/icons'
import { Form, Segmented, Typography, Button, Flex } from 'antd'
import React, { useState } from 'react'
import { CustomRangesForm } from './custom-ranges-form'
import { FixedRangesForm } from './fixed-ranges-form'
import { FixedSplitValue, RangeFormValue, SplitMode } from '../types'
import { SidebarContent, SidebarLayout } from '@/layout/page-layout'

const { Title, Text } = Typography

interface SplitSiderProps {
	totalPages: number
	onRangesChange: (ranges: RangeFormValue) => void
	onBack: () => void
}

export const SplitSider: React.FC<SplitSiderProps> = ({
	totalPages,
	onRangesChange,
	onBack,
}) => {
	const [splitMode, setSplitMode] = useState<SplitMode>('custom')
	const [form] = Form.useForm<RangeFormValue>()
	const [fixedForm] = Form.useForm<FixedSplitValue>()

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
						Split
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
					<Text>Split mode:</Text>
					<Segmented
						block
						options={[
							{ label: 'Custom Ranges', value: 'custom' },
							{ label: 'Fixed Ranges', value: 'fixed' },
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
