import { LeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { MergedPDFPreview } from './MergedPDFPreview'

const { Title } = Typography

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 64px);
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

export interface MergeSuccessProps {
	onBack: () => void
	onDownload: () => void
	mergedPdfBytes: Uint8Array
	title?: string
	downloadButtonText?: string
}

export const MergeSuccess: React.FC<MergeSuccessProps> = ({
	onBack,
	onDownload,
	mergedPdfBytes,
	title = 'PDFs merged successfully!',
	downloadButtonText = 'Download merged PDF',
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
				<Title level={2}>{title}</Title>
				<MergedPDFPreview pdfBytes={mergedPdfBytes} />
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
