import { PDFDocument, PDFPage } from 'pdf-lib'
import { UploadFile } from 'antd'

export const mergePDFs = async (files: UploadFile[]): Promise<Uint8Array> => {
	try {
		// Create a new PDF document
		const mergedPdf = await PDFDocument.create()

		// Process each file in order
		for (const file of files) {
			if (!file.originFileObj) {
				throw new Error(`File ${file.name} is not available`)
			}

			// Convert File to ArrayBuffer
			const fileBuffer = await file.originFileObj.arrayBuffer()

			// Load the PDF document
			const pdf = await PDFDocument.load(fileBuffer)

			// Copy all pages from the current PDF to the merged PDF
			const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
			copiedPages.forEach((page: PDFPage) => mergedPdf.addPage(page))
		}

		// Save the merged PDF
		return await mergedPdf.save()
	} catch (error) {
		console.error('Error merging PDFs:', error)
		throw error
	}
}

export const downloadPDF = (
	pdfBytes: Uint8Array,
	filename: string = 'merged.pdf'
) => {
	// Create a blob from the PDF bytes
	const blob = new Blob([pdfBytes], { type: 'application/pdf' })

	// Create a URL for the blob
	const url = URL.createObjectURL(blob)

	// Create a temporary link element
	const link = document.createElement('a')
	link.href = url
	link.download = filename

	// Append to document, click, and cleanup
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	// Cleanup the URL object
	URL.revokeObjectURL(url)
}
