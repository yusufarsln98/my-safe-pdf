import { LeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { PDFPreview } from './pdf-preview'

const { Title } = Typography

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 120px);
	padding: 24px;
	position: relative;
`

const BackButton = styled(Button)`
	position: absolute;
	top: 24px;
	left: 24px;
`

const DownloadButton = styled(Button)`
	width: 100%;
	max-width: 400px;
	height: 56px;
	margin-top: 16px;

	.anticon {
		font-size: 24px;
	}
`

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 400px;
	width: 100%;
`

export interface SuccessScreenProps {
	onBack: () => void
	onDownload: () => void
	pdfBytes: Uint8Array
	title?: string
	downloadButtonText?: string
	hidePreview?: boolean
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
	onBack,
	onDownload,
	pdfBytes,
	title = 'Operation completed successfully!',
	downloadButtonText = 'Download PDF',
	hidePreview,
}) => {
	return (
		<Container>
			<BackButton
				icon={<LeftOutlined />}
				type='text'
				onClick={onBack}
				shape='circle'
				size='large'
			/>
			<ContentContainer>
				<Title
					level={2}
					style={{
						textAlign: 'center',
					}}
				>
					{title}
				</Title>
				{!hidePreview && <PDFPreview pdfBytes={pdfBytes} />}
				<DownloadButton
					type='primary'
					size='large'
					icon={<DownloadOutlined />}
					onClick={onDownload}
				>
					{downloadButtonText}
				</DownloadButton>
			</ContentContainer>
		</Container>
	)
}
