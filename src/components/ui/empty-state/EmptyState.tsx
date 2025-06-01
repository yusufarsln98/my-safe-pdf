import { InboxOutlined } from '@ant-design/icons'
import { Typography, Upload, Flex } from 'antd'
import type { UploadProps, FlexProps } from 'antd'
import React from 'react'

const { Title, Paragraph } = Typography
const { Dragger } = Upload

export interface EmptyStateProps {
	title?: string
	description?: string
	uploadProps?: UploadProps
	uploadText?: string
	uploadHint?: string
	icon?: React.ReactNode
	containerProps?: FlexProps
	showUploader?: boolean
	children?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	uploadProps,
	uploadText = 'Click or drag files to upload',
	uploadHint = 'You can select multiple files',
	icon = <InboxOutlined />,
	containerProps,
	showUploader = true,
	children,
}) => {
	return (
		<Flex
			vertical
			gap={32}
			{...containerProps}
		>
			{(title || description) && (
				<Flex vertical>
					{title && <Title level={2}>{title}</Title>}
					{description && <Paragraph type='secondary'>{description}</Paragraph>}
				</Flex>
			)}

			{children}

			{showUploader && uploadProps && (
				<Dragger
					{...uploadProps}
					style={{ padding: 24 }}
					showUploadList={false}
				>
					<p className='ant-upload-drag-icon'>{icon}</p>
					<p className='ant-upload-text'>{uploadText}</p>
					<p className='ant-upload-hint'>{uploadHint}</p>
				</Dragger>
			)}
		</Flex>
	)
}
