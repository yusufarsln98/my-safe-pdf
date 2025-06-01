import { EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const PreviewButton = styled(Button)`
	margin: 32px 0;
	height: 48px;
	width: 100%;
	max-width: 400px;
`

export interface MergedPDFPreviewProps {
	pdfBytes: Uint8Array
	previewButtonText?: string
}

export const MergedPDFPreview: React.FC<MergedPDFPreviewProps> = ({
	pdfBytes,
	previewButtonText = 'Preview PDF',
}) => {
	const [previewUrl, setPreviewUrl] = useState<string>('')

	useEffect(() => {
		// Create a blob URL for the PDF
		const blob = new Blob([pdfBytes], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)
		setPreviewUrl(url)

		// Cleanup the URL when component unmounts
		return () => {
			URL.revokeObjectURL(url)
		}
	}, [pdfBytes])

	const handlePreview = () => {
		if (previewUrl) {
			window.open(previewUrl, '_blank')
		}
	}

	return (
		<PreviewButton
			icon={<EyeOutlined />}
			onClick={handlePreview}
			size='large'
			type='link'
		>
			{previewButtonText}
		</PreviewButton>
	)
}
