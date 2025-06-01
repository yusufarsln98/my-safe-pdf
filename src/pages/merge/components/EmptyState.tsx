import React from 'react'
import { Typography, Upload, Flex } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Title, Paragraph } = Typography
const { Dragger } = Upload

interface EmptyStateProps {
	uploadProps: UploadProps
}

export const EmptyState: React.FC<EmptyStateProps> = ({ uploadProps }) => {
	return (
		<Flex
			vertical
			gap={32}
		>
			<Flex vertical>
				<Title level={2}>PDF Birleştir</Title>
				<Paragraph type='secondary'>
					Birden fazla PDF dosyasını tek bir PDF'te birleştirin. Dosyaları
					sürükleyip bırakın veya seçin, sıralamayı değiştirin ve birleştirin.
				</Paragraph>
			</Flex>

			<Dragger
				{...uploadProps}
				style={{ padding: 24 }}
				showUploadList={false}
			>
				<p className='ant-upload-drag-icon'>
					<InboxOutlined />
				</p>
				<p className='ant-upload-text'>
					PDF dosyalarını yüklemek için tıklayın veya sürükleyin
				</p>
				<p className='ant-upload-hint'>
					Birden fazla PDF dosyası seçebilirsiniz
				</p>
			</Dragger>
		</Flex>
	)
}
