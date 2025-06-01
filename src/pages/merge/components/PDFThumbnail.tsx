import React from 'react'
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

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ file }) => {
	// Convert File object to URL if needed
	const pdfUrl =
		file instanceof File
			? URL.createObjectURL(file)
			: typeof file === 'string'
				? file
				: file.url

	React.useEffect(() => {
		// Cleanup URL when component unmounts
		return () => {
			if (file instanceof File) {
				URL.revokeObjectURL(pdfUrl)
			}
		}
	}, [file, pdfUrl])

	return (
		<Document
			file={pdfUrl}
			loading={<LoadingText>Yükleniyor...</LoadingText>}
			error={<LoadingText>Yüklenemedi</LoadingText>}
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
