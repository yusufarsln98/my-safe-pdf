import { UploadFile } from 'antd'
import { PDFDocument } from 'pdf-lib'
import { PDFError } from './mergeUtils'

export interface ImageToPDFOptions {
  files: UploadFile[]
  onProgress?: (progress: number) => void
}

export const convertImagesToPDFs = async ({
  files,
  onProgress,
}: ImageToPDFOptions): Promise<Uint8Array[]> => {
  try {
    const pdfBytesList: Uint8Array[] = []
    const totalFiles = files.length

    // Process each file
    for (const [index, file] of files.entries()) {
      if (!file.originFileObj) {
        throw new PDFError(`File ${file.name} is not available`)
      }

      try {
        // Convert file to ArrayBuffer
        const fileBuffer = await file.originFileObj.arrayBuffer()
        
        // Determine file type
        const fileType = file.type || ''
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()
        
        // Add image based on type
        if (fileType.includes('jpeg') || fileType.includes('jpg')) {
          const image = await pdfDoc.embedJpg(fileBuffer)
          const page = pdfDoc.addPage([image.width, image.height])
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          })
        } else if (fileType.includes('png')) {
          const image = await pdfDoc.embedPng(fileBuffer)
          const page = pdfDoc.addPage([image.width, image.height])
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          })
        } else {
          throw new PDFError(`Unsupported file type: ${fileType}`)
        }

        // Save PDF and add to list
        const pdfBytes = await pdfDoc.save()
        pdfBytesList.push(pdfBytes)

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

    return pdfBytesList
  } catch (error) {
    if (error instanceof PDFError) {
      throw error
    }
    throw new PDFError(
      'Error converting images to PDFs',
      error instanceof Error ? error : undefined
    )
  }
}
