import { UploadFile } from 'antd'
import JSZip from 'jszip'
import { PDFDocument } from 'pdf-lib'
import { PDFError, downloadPDF } from './mergeUtils'

export interface PDFRange {
	from: number
	to: number
}

export interface PDFSplitOptions {
	file: UploadFile
	ranges: PDFRange[]
	onProgress?: (progress: number) => void
}

export const splitPDF = async ({
	file,
	ranges,
	onProgress,
}: PDFSplitOptions): Promise<Uint8Array[]> => {
	try {
		if (!file.originFileObj) {
			throw new PDFError(`File ${file.name} is not available`)
		}

		// Convert File to ArrayBuffer
		const fileBuffer = await file.originFileObj.arrayBuffer()

		// Load the source PDF document
		const sourcePdf = await PDFDocument.load(fileBuffer)
		const splitPdfs: Uint8Array[] = []

		for (const [index, range] of ranges.entries()) {
			// Create a new PDF document for this range
			const newPdf = await PDFDocument.create()

			// Copy the specified pages
			const pages = await newPdf.copyPages(
				sourcePdf,
				Array.from(
					{ length: range.to - range.from + 1 },
					(_, i) => range.from - 1 + i
				)
			)

			// Add the pages to the new document
			pages.forEach((page) => newPdf.addPage(page))

			// Save the new PDF
			const pdfBytes = await newPdf.save()
			splitPdfs.push(pdfBytes)

			// Report progress
			if (onProgress) {
				onProgress((index + 1) / ranges.length)
			}
		}

		return splitPdfs
	} catch (error) {
		if (error instanceof PDFError) {
			throw error
		}
		throw new PDFError(
			'Error splitting PDF',
			error instanceof Error ? error : undefined
		)
	}
}

export const downloadSplitPDFs = async (
	pdfBytesList: Uint8Array[],
	originalFileName: string
): Promise<void> => {
	try {
		// If there's only one PDF, download it directly
		if (pdfBytesList.length === 1) {
			downloadPDF({
				pdfBytes: pdfBytesList[0],
				filename: `${originalFileName.replace('.pdf', '')}_split.pdf`,
			})
			return
		}

		// For multiple PDFs, create a zip file
		const zip = new JSZip()
		const baseFileName = originalFileName.replace('.pdf', '')

		// Add each PDF to the zip
		pdfBytesList.forEach((pdfBytes, index) => {
			zip.file(`${baseFileName}_part${index + 1}.pdf`, pdfBytes)
		})

		// Generate the zip file
		const zipContent = await zip.generateAsync({ type: 'blob' })

		// Create a download link for the zip
		const url = URL.createObjectURL(zipContent)
		const link = document.createElement('a')
		link.href = url
		link.download = `${baseFileName}_split.zip`

		// Trigger download
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Cleanup
		setTimeout(() => {
			URL.revokeObjectURL(url)
		}, 100)
	} catch (error) {
		throw new PDFError(
			'Error downloading split PDFs',
			error instanceof Error ? error : undefined
		)
	}
}
