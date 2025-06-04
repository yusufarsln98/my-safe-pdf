import { Button, message, Grid } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageToPdfSider } from './components/image-to-pdf-sider.js'
import { GridSortablePdfList } from '@/components/features/pdf'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingSettingsButton } from '@/components/ui/floating-settings-button'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout, ResponsiveSidebarDrawer } from '@/layout/page-layout'
import { mergePDFs, downloadPDF } from '@/utils/pdf/mergeUtils'
import { convertImagesToPDFs } from '@/utils/pdf/imageUtils'

interface ImageToPdfProps {}

export const ImageToPdf: React.FC<ImageToPdfProps> = () => {
  const { fileList, uploadProps, setFileList, removeFile } = usePdfFiles({
    maxFiles: 10, // Up to 10 files can be added
  })
  const [convertedPdfBytes, setConvertedPdfBytes] = useState<Uint8Array | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const screens = Grid.useBreakpoint()
  const isSmallScreen = !screens.md
  const { t } = useTranslation()

  // Convert images to PDF
  const handleConvert = async () => {
    if (fileList.length === 0) {
      message.error('Please upload at least one image file')
      return
    }

    try {
      setIsProcessing(true)
      message.loading({
        content: 'Converting images to PDF...',
        key: 'converting',
      })

      // Convert images to PDF
      const pdfBytesList = await convertImagesToPDFs({
        files: fileList,
        onProgress: (progress) => {
          message.loading({
            content: `Converting images: ${Math.round(progress * 100)}%`,
            key: 'converting',
          })
        },
      })

      // If multiple PDFs are generated, merge them
      let finalPdfBytes: Uint8Array
      if (pdfBytesList.length > 1) {
        message.loading({
          content: 'Merging PDFs...',
          key: 'converting',
        })

        // Convert PDF bytes to UploadFile format
        const pdfFiles = pdfBytesList.map((bytes, index) => {
          const blob = new Blob([bytes], { type: 'application/pdf' })
          const uid = `pdf-${index + 1}`

          return {
            uid,
            name: `Image ${index + 1}.pdf`,
            type: 'application/pdf',
            size: blob.size,
            originFileObj: new File([blob], `${uid}.pdf`, {
              type: 'application/pdf',
              lastModified: Date.now(),
            }),
          } as UploadFile
        })

        // Merge PDFs
        finalPdfBytes = await mergePDFs({
          files: pdfFiles,
          onProgress: (progress) => {
            message.loading({
              content: `Merging PDFs: ${Math.round(progress * 100)}%`,
              key: 'converting',
            })
          },
        })
      } else {
        finalPdfBytes = pdfBytesList[0]
      }

      setConvertedPdfBytes(finalPdfBytes)
      message.success({
        content: 'Images converted to PDF successfully',
        key: 'converting',
      })
    } catch (error) {
      console.error('Error converting images to PDF:', error)
      message.error({
        content: 'Failed to convert images to PDF',
        key: 'converting',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Download PDF
  const handleDownload = () => {
    if (convertedPdfBytes) {
      downloadPDF({
        pdfBytes: convertedPdfBytes,
        filename: 'images_to_pdf.pdf',
      })
    }
  }

  // Go back and clear
  const handleBack = () => {
    setConvertedPdfBytes(null)
    setFileList([])
  }

  // If conversion is complete, show success screen
  if (convertedPdfBytes) {
    return (
      <SuccessScreen
        onBack={handleBack}
        onDownload={handleDownload}
        pdfBytes={convertedPdfBytes}
        title="Images converted to PDF successfully"
        downloadButtonText="Download PDF"
        hidePreview={false}
      />
    )
  }

  // Sidebar content
  const siderContent =
    fileList.length > 0 ? <ImageToPdfSider onBack={handleBack} /> : undefined

  // Advanced upload properties
  const enhancedUploadProps = {
    ...uploadProps,
    accept: '.jpg,.jpeg,.png',
    multiple: true,
  }

  return (
    <PageLayout sider={!isSmallScreen ? siderContent : undefined}>
      {fileList.length === 0 ? (
        <EmptyState
          uploadProps={enhancedUploadProps}
          title="Image to PDF"
          description="Upload image files to convert them to PDF"
          uploadHint="Upload JPG, JPEG or PNG files"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '24px',
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <GridSortablePdfList
              files={fileList}
              onFilesChange={setFileList}
              onRemoveFile={removeFile}
              showDeleteButton={true}
            />
          </div>
          <Button
            type="primary"
            size="large"
            disabled={fileList.length === 0 || isProcessing}
            onClick={handleConvert}
            loading={isProcessing}
          >
            Convert to PDF
          </Button>
        </div>
      )}
      {isSmallScreen && fileList.length > 0 && (
        <>
          <ResponsiveSidebarDrawer
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
          >
            {siderContent}
          </ResponsiveSidebarDrawer>
          <FloatingSettingsButton onClick={() => setDrawerVisible(true)} />
        </>
      )}
    </PageLayout>
  )
}
