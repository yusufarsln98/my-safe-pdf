import { Form, Segmented, Typography } from 'antd'
import React, { useState } from 'react'
import { CustomRangesForm } from './custom-ranges-form'
import { FixedRangesForm } from './fixed-ranges-form'
import {
	FixedSplitValue,
	RangeFormValue,
	SplitMode,
	SplitSiderProps,
} from '../types'
import { SidebarContent, SidebarLayout } from '@/layout/page-layout'

const { Title, Text } = Typography

export const SplitSider: React.FC<SplitSiderProps> = ({
	totalPages,
	onRangesChange,
}) => {
	const [splitMode, setSplitMode] = useState<SplitMode>('custom')
	const [form] = Form.useForm<RangeFormValue>()
	const [fixedForm] = Form.useForm<FixedSplitValue>()

	return (
		<SidebarLayout
			title={
				<Title
					level={5}
					style={{ margin: 0, padding: 0 }}
				>
					Split
				</Title>
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
