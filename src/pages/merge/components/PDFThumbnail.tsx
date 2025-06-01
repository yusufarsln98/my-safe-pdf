import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import styled from 'styled-components'

// Set the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const LoadingText = styled.div`
	color: ${(props) => props.theme.colorTextDescription};
	font-size: 12px;
`

interface PDFThumbnailProps {
	file: File | string | { url: string }
}

const PDFThumbnailComponent: React.FC<PDFThumbnailProps> = ({ file }) => {
	const [fileData, setFileData] = useState<ArrayBuffer | string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadFile = async () => {
			try {
				if (file instanceof File) {
					const buffer = await file.arrayBuffer()
					setFileData(buffer)
				} else if (typeof file === 'string') {
					setFileData(file)
				} else if (file && typeof file === 'object' && 'url' in file) {
					setFileData(file.url)
				} else {
					throw new Error('Invalid file type')
				}
			} catch (err) {
				console.error('Error loading file:', err)
				setError('PDF yüklenemedi')
			}
		}

		loadFile()
	}, [file])

	if (error || !fileData) {
		return <LoadingText>{error || 'Yükleniyor...'}</LoadingText>
	}

	return (
		<Document
			file={fileData}
			loading={<LoadingText>Yükleniyor...</LoadingText>}
			error={<LoadingText>Yüklenemedi</LoadingText>}
			onLoadError={(err: Error) => {
				console.error('PDF load error:', err)
				setError('PDF yüklenemedi')
			}}
		>
			<Page
				pageNumber={1}
				width={170}
				height={240}
				renderAnnotationLayer={false}
				renderTextLayer={false}
			/>
		</Document>
	)
}

export const PDFThumbnail = React.memo(PDFThumbnailComponent)
