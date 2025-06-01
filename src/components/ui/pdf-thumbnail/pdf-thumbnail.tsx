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

const ThumbnailContainer = styled.div`
	position: relative;
	width: 170px;
	height: 240px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${(props) => props.theme.colorBgContainer};
	border-radius: 4px;
	overflow: hidden;
`

export type PDFSource = File | string | { url: string }

export interface PDFThumbnailProps {
	file: PDFSource
	width?: number
	height?: number
	onLoadSuccess?: (info: { numPages: number }) => void
	onLoadError?: (error: Error) => void
	loadingText?: string
	errorText?: string
	pageNumber?: number
}

const PDFThumbnailComponent: React.FC<PDFThumbnailProps> = ({
	file,
	width = 170,
	height = 240,
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
				const error = err instanceof Error ? err : new Error('Unknown error')
				setError(errorText)
				onLoadError?.(error)
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
						width={width}
						height={height}
						renderAnnotationLayer={false}
						renderTextLayer={false}
					/>
				</Document>
			)}
		</ThumbnailContainer>
	)
}

export const PDFThumbnail = React.memo(PDFThumbnailComponent)
