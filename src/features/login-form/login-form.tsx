import { Form, Input, Button, Checkbox, Card, Typography } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const StyledCard = styled(Card)`
	width: 100%;
	max-width: 400px;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const LoginButton = styled(Button)`
	width: 100%;
	height: 40px;
	background-color: ${(props) => props.theme.colorPrimary};
`

const FormContainer = styled.div`
	text-align: center;
`

// Form data type definition
export interface LoginFormData {
	email: string
	password: string
	remember?: boolean
}

// Component props type definition
export interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
	const [form] = Form.useForm<LoginFormData>()
	const [loading, setLoading] = useState<boolean>(false)

	const handleSubmit = async (values: LoginFormData) => {
		setLoading(true)
		try {
			await onSubmit(values)
		} finally {
			setLoading(false)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const validateEmail = (_: any, value: string): Promise<void> => {
		if (!value) {
			return Promise.reject('Email is required')
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(value)) {
			return Promise.reject('Invalid email address')
		}
		return Promise.resolve()
	}

	return (
		<StyledCard>
			<FormContainer>
				<Title level={2}>Welcome Back</Title>
				<Paragraph type='secondary'>Login to your account</Paragraph>

				<Form<LoginFormData>
					form={form}
					layout='vertical'
					initialValues={{ email: '', password: '', remember: false }}
					onFinish={handleSubmit}
				>
					<Form.Item
						name='email'
						label='Email'
						rules={[{ validator: validateEmail }]}
					>
						<Input placeholder='Enter your email' />
					</Form.Item>

					<Form.Item
						name='password'
						label='Password'
						rules={[
							{ required: true, message: 'Password is required' },
							{ min: 5, message: 'Password must be at least 5 characters' },
						]}
					>
						<Input.Password placeholder='Enter your password' />
					</Form.Item>

					<Form.Item
						name='remember'
						valuePropName='checked'
					>
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item>
						<LoginButton
							type='primary'
							htmlType='submit'
							loading={loading}
						>
							Login
						</LoginButton>
					</Form.Item>
				</Form>
			</FormContainer>
		</StyledCard>
	)
}
