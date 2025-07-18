import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import styled from 'styled-components'

// Set the worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const LoadingText = styled.div`
	color: ${(props) => props.theme.colorTextDescription};
	font-size: 12px;
`

const ThumbnailContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${(props) => props.theme.colorBgContainer};
	border-radius: 4px;
	overflow: hidden;

	.react-pdf__Page__canvas {
		width: 100% !important;
		height: 100% !important;
	}
`

export type PDFSource = File | string

export interface PDFThumbnailProps {
	file: PDFSource
	onLoadSuccess?: (info: { numPages: number }) => void
	onLoadError?: (error: Error) => void
	loadingText?: string
	errorText?: string
	pageNumber?: number
}

const PDFThumbnailComponent: React.FC<PDFThumbnailProps> = ({
	file,
	onLoadSuccess,
	onLoadError,
	loadingText = 'Loading...',
	errorText = 'Failed to load PDF',
	pageNumber = 1,
}) => {
	const [fileData, setFileData] = useState<ArrayBuffer | string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadFile = async () => {
			try {
				if (file instanceof File) {
					// If PDF file is a File object, convert it to ArrayBuffer
					const buffer = await file.arrayBuffer()
					setFileData(buffer)
				} else if (typeof file === 'string') {
					// If PDF file is a URL string, use it directly
					setFileData(file)
				} else {
					throw new Error('Invalid file type: PDF source must be a File or URL string')
				}
			} catch (err) {
				console.error('Error loading PDF file:', err)
				setError(errorText)
				if (onLoadError) {
					const error = err instanceof Error ? err : new Error('Unknown PDF loading error')
					onLoadError(error)
				}
			}
		}

		loadFile()
	}, [file, errorText, onLoadError])

	return (
		<ThumbnailContainer>
			{error || !fileData ? (
				<LoadingText>{error || loadingText}</LoadingText>
			) : (
				<Document
					file={fileData}
					loading={<LoadingText>{loadingText}</LoadingText>}
					error={<LoadingText>{errorText}</LoadingText>}
					onLoadError={(err: Error) => {
						console.error('PDF load error:', err)
						setError(errorText)
						onLoadError?.(err)
					}}
					onLoadSuccess={onLoadSuccess}
				>
					<Page
						pageNumber={pageNumber}
						renderAnnotationLayer={false}
						renderTextLayer={false}
					/>
				</Document>
			)}
		</ThumbnailContainer>
	)
}

export const PDFThumbnail = React.memo(PDFThumbnailComponent)