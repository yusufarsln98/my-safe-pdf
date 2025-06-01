import { Alert, Form, FormInstance, InputNumber } from 'antd'
import React, { useCallback, useState } from 'react'
import { FixedSplitValue, RangeFormValue } from '../types'
import { calculateFileCount } from '../utils/split-utils'

interface FixedRangesFormProps {
	form: FormInstance<FixedSplitValue>
	totalPages: number
	onValuesChange: (values: RangeFormValue) => void
}

export const FixedRangesForm: React.FC<FixedRangesFormProps> = ({
	form,
	totalPages,
	onValuesChange,
}) => {
	const [pagesPerFile, setPagesPerFile] = useState<number>(1)

	const convertToRangeFormValue = useCallback(
		(pagesPerFile: number): RangeFormValue => {
			const ranges = []
			let currentPage = 1

			while (currentPage <= totalPages) {
				const endPage = Math.min(currentPage + pagesPerFile - 1, totalPages)
				ranges.push({
					from: currentPage,
					to: endPage,
				})
				currentPage = endPage + 1
			}

			return { ranges }
		},
		[totalPages]
	)

	const validateAndNotify = useCallback(async () => {
		try {
			const values = form.getFieldsValue()
			await form.validateFields()
			if (
				values.pagesPerFile &&
				values.pagesPerFile > 0 &&
				values.pagesPerFile <= totalPages
			) {
				const rangeFormValue = convertToRangeFormValue(values.pagesPerFile)
				onValuesChange(rangeFormValue)
			}
		} catch (error) {
			console.debug('Validation failed:', error)
		}
	}, [form, onValuesChange, convertToRangeFormValue, totalPages])

	const handleInputBlur = useCallback(() => {
		setTimeout(validateAndNotify, 100)
	}, [validateAndNotify])

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{ pagesPerFile: 1 }}
		>
			<Form.Item
				label='Pages per file:'
				name='pagesPerFile'
				rules={[
					{
						required: true,
						message: 'Pages per file is required',
					},
					{
						type: 'number',
						min: 1,
						max: totalPages,
						message: `Must be between 1 and ${totalPages}`,
					},
				]}
			>
				<InputNumber
					min={1}
					max={totalPages}
					style={{ width: '100%' }}
					onChange={(value) => setPagesPerFile(value || 1)}
					onBlur={handleInputBlur}
					controls={{
						upIcon: '▲',
						downIcon: '▼',
					}}
				/>
			</Form.Item>
			<Alert
				message={`This PDF will be split into files with ${pagesPerFile} page(s) each.\n${calculateFileCount(totalPages, pagesPerFile)} PDF files will be created.`}
				type='info'
				style={{ marginBottom: 16 }}
			/>
		</Form>
	)
}
