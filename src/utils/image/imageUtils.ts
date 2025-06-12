import { UploadFile } from 'antd'
import { PDFDocument, PageSizes } from 'pdf-lib'
import { PDFError } from '../pdf/mergeUtils'

// Image resizing options
export enum ImageFitOption {
  ORIGINAL = 'original',
  FIT_TO_PAGE = 'fitToPage',
}

export interface ImageToPDFOptions {
  files: UploadFile[]
  onProgress?: (progress: number) => void
  fitOption?: ImageFitOption // Image resize option
}

export const convertImagesToPDFs = async ({
  files,
  onProgress,
  fitOption = ImageFitOption.ORIGINAL, // Original size by default
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
        const fileName = file.name?.toLowerCase() || ''
        
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()
        
        // Add image based on type
        let image;
        if (fileType.includes('jpeg') || fileType.includes('jpg') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          image = await pdfDoc.embedJpg(fileBuffer)
        } else if (fileType.includes('png') || fileName.endsWith('.png')) {
          image = await pdfDoc.embedPng(fileBuffer)
        } else {
          throw new PDFError(`Unsupported file type: ${fileType} for file ${file.name}. Only JPG and PNG files are supported.`)
        }
        
        // Adjust page and image sizes according to the sizing option
        let pageSize: [number, number];
        let imageSize: [number, number];
        let position: [number, number];
        
        if (fitOption === ImageFitOption.FIT_TO_PAGE) {
          // Use A4 page size with margins
          pageSize = PageSizes.A4;
          const margin = 20; // 20 points margin on each side
          
          // Calculate image dimensions while preserving aspect ratio
          const imageRatio = image.width / image.height;
          const pageRatio = pageSize[0] / pageSize[1];
          
          // Determine if we should fit by width or height
          const availableWidth = pageSize[0] - (margin * 2);
          const availableHeight = pageSize[1] - (margin * 2);
          
          // Scale image to fit page while maintaining aspect ratio
          if (imageRatio > pageRatio) {
            // Fit by width
            imageSize = [availableWidth, availableWidth / imageRatio];
          } else {
            // Fit by height
            imageSize = [availableHeight * imageRatio, availableHeight];
          }
          
          // Center the image on the page
          position = [
            (pageSize[0] - imageSize[0]) / 2,
            (pageSize[1] - imageSize[1]) / 2
          ];
        } else {
          // Use original image dimensions
          pageSize = [image.width, image.height];
          imageSize = [image.width, image.height];
          position = [0, 0];
        }
        
        // Create page and draw the image
        const page = pdfDoc.addPage(pageSize);
        page.drawImage(image, {
          x: position[0],
          y: position[1],
          width: imageSize[0],
          height: imageSize[1],
        })

        // Save PDF and add to list
        const pdfBytes = await pdfDoc.save()
        pdfBytesList.push(pdfBytes)

        // Report progress
        if (onProgress) {
          onProgress((index + 1) / totalFiles)
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        throw new PDFError(
          `Error processing file ${file.name}. Please make sure it is a valid JPG or PNG file.`,
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
