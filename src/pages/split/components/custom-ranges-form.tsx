import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Form, FormInstance, InputNumber, Space } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { PageRange, RangeFormValue } from '../types'

interface CustomRangesFormProps {
	form: FormInstance<RangeFormValue>
	totalPages: number
	onValuesChange: (values: RangeFormValue) => void
}

export const CustomRangesForm: React.FC<CustomRangesFormProps> = ({
	form,
	totalPages,
	onValuesChange,
}) => {
	const validateAndNotify = useCallback(async () => {
		try {
			const values = form.getFieldsValue()

			await form.validateFields()

			if (values.ranges && values.ranges.length > 0) {
				const completeRanges = values.ranges.filter(
					(range: PageRange) => range?.from && range?.to
				)

				if (completeRanges.length > 0) {
					onValuesChange({ ranges: completeRanges })
				}
			}
		} catch (error) {
			console.debug('Validation failed:', error)
		}
	}, [form, onValuesChange])

	const handleInputBlur = useCallback(() => {
		setTimeout(validateAndNotify, 100)
	}, [validateAndNotify])

	useEffect(() => {
		if (totalPages > 0) {
			form.setFieldsValue({
				ranges: [{ from: 1, to: totalPages }],
			})
		}
	}, [totalPages, form])

	return (
		<Form
			form={form}
			name='pdf_range_form'
			layout='vertical'
		>
			<Form.List name='ranges'>
				{(fields, { add, remove }, { errors }) => (
					<>
						{fields.map((field, index) => (
							<Card
								key={field.key}
								size='small'
								title={`Range ${index + 1}`}
								style={{ marginBottom: 8 }}
								styles={{ body: { paddingBottom: 0 } }}
								extra={
									fields.length > 1 && (
										<Button
											icon={<CloseOutlined />}
											onClick={() => {
												remove(field.name)
												validateAndNotify()
											}}
											variant='text'
											color='danger'
										/>
									)
								}
							>
								<Space align='baseline'>
									<Form.Item
										label='From page:'
										name={[field.name, 'from']}
										validateTrigger={['onChange', 'onBlur']}
										rules={[
											{
												required: true,
												message: '',
											},
										]}
									>
										<InputNumber
											placeholder='1'
											style={{ width: '100%' }}
											min={1}
											max={totalPages}
											onBlur={handleInputBlur}
											autoFocus
										/>
									</Form.Item>

									<Form.Item
										label='To page:'
										name={[field.name, 'to']}
										validateTrigger={['onChange', 'onBlur']}
										rules={[
											{
												required: true,
												message: '',
											},
										]}
									>
										<InputNumber
											placeholder={totalPages.toString()}
											style={{ width: '100%' }}
											min={1}
											max={totalPages}
											onBlur={handleInputBlur}
										/>
									</Form.Item>
								</Space>
							</Card>
						))}
						<Button
							type='dashed'
							onClick={() => {
								add({ from: 1, to: totalPages })
							}}
							icon={<PlusOutlined />}
							style={{ width: '100%' }}
						>
							Add Range
						</Button>
						<Form.ErrorList errors={errors} />
					</>
				)}
			</Form.List>
		</Form>
	)
}
