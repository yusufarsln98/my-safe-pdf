import { UploadFile } from 'antd'
import { PDFDocument, PDFPage, degrees } from 'pdf-lib'

export class PDFError extends Error {
	constructor(
		message: string,
		public originalError?: Error
	) {
		super(message)
		this.name = 'PDFError'
	}
}

export interface PDFMergeOptions {
	files: UploadFile[]
	onProgress?: (progress: number) => void
}

export interface PDFDownloadOptions {
	pdfBytes: Uint8Array
	filename?: string
	openInNewTab?: boolean
}

export const mergePDFs = async ({
	files,
	onProgress,
}: PDFMergeOptions): Promise<Uint8Array> => {
	try {
		// Create a new PDF document
		const mergedPdf = await PDFDocument.create()
		const totalFiles = files.length

		// Process each file in order
		for (const [index, file] of files.entries()) {
			if (!file.originFileObj) {
				throw new PDFError(`File ${file.name} is not available`)
			}

			try {
				// Convert File to ArrayBuffer
				const fileBuffer = await file.originFileObj.arrayBuffer()

				// Load the PDF document
				const pdf = await PDFDocument.load(fileBuffer)

				// Copy all pages from the current PDF to the merged PDF
				const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
				copiedPages.forEach((page: PDFPage) => mergedPdf.addPage(page))

				// Report progress
				if (onProgress) {
					onProgress((index + 1) / totalFiles)
				}
			} catch (error) {
				throw new PDFError(
					`Error processing file ${file.name}`,
					error instanceof Error ? error : undefined
				)
			}
		}

		// Save the merged PDF
		return await mergedPdf.save()
	} catch (error) {
		if (error instanceof PDFError) {
			throw error
		}
		throw new PDFError(
			'Error merging PDFs',
			error instanceof Error ? error : undefined
		)
	}
}

export const downloadPDF = ({
	pdfBytes,
	filename = 'merged.pdf',
	openInNewTab = false,
}: PDFDownloadOptions): void => {
	try {
		// Create a blob from the PDF bytes
		const blob = new Blob([pdfBytes], { type: 'application/pdf' })

		// Create a URL for the blob
		const url = URL.createObjectURL(blob)

		if (openInNewTab) {
			// Open in new tab
			window.open(url, '_blank')
		} else {
			// Download file
			const link = document.createElement('a')
			link.href = url
			link.download = filename

			// Append to document, click, and cleanup
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}

		// Cleanup the URL object after a short delay to ensure the download starts
		setTimeout(() => {
			URL.revokeObjectURL(url)
		}, 100)
	} catch (error) {
		throw new PDFError(
			'Error downloading PDF',
			error instanceof Error ? error : undefined
		)
	}
}

export const rotatePDF = async ({
	file,
}: {
	file: UploadFile
}): Promise<Uint8Array> => {
	try {
		// Get the PDF file as an ArrayBuffer
		let pdfBytes: ArrayBuffer
		if (file.originFileObj) {
			pdfBytes = await file.originFileObj.arrayBuffer()
		} else if (file.url) {
			const response = await fetch(file.url)
			pdfBytes = await response.arrayBuffer()
		} else {
			throw new Error('Invalid file source')
		}

		// Load the PDF document
		const pdfDoc = await PDFDocument.load(pdfBytes)
		const pages = pdfDoc.getPages()

		// Rotate each page by 90 degrees clockwise
		pages.forEach((page) => {
			const currentRotation = page.getRotation().angle
			page.setRotation(degrees((currentRotation + 90) % 360))
		})

		// Save the modified document
		return await pdfDoc.save()
	} catch (error) {
		console.error('Error rotating PDF:', error)
		throw error
	}
}
