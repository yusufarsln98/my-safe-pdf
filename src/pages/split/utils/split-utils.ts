import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export const calculateFileCount = (
	totalPages: number,
	pagesPerFile: number
): number => {
	return Math.ceil(totalPages / pagesPerFile)
}

// More reliable PDF page count function
export const getPdfPageCountWithPdfJs = async (file: File): Promise<number> => {
	try {
		const arrayBuffer = await file.arrayBuffer()
		const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
		return pdf.numPages
	} catch (error) {
		console.error('Error parsing PDF with PDF.js:', error)
		throw error
	}
}
