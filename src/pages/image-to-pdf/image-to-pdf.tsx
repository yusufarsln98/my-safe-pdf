import { Button, message, Grid, Radio, Space, Typography } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageToPdfSider } from './components/image-to-pdf-sider.js'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingSettingsButton } from '@/components/ui/floating-settings-button'
import { FloatingUploadButton } from '@/components/ui/floating-upload-button'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout, ResponsiveSidebarDrawer } from '@/layout/page-layout'
import { mergePDFs, downloadPDF } from '@/utils/pdf/mergeUtils'
import { convertImagesToPDFs, ImageFitOption } from '@/utils/image/imageUtils'
import { ImageGridSortableList } from '@/components/features/pdf/grid-sortable-list/image-grid-sortable-list'

interface ImageToPdfProps {}

export const ImageToPdf: React.FC<ImageToPdfProps> = () => {
  const { t } = useTranslation()

  const { fileList, uploadProps, setFileList, removeFile } = usePdfFiles({
    maxFiles: 10, // Up to 10 files can be added
  })
  const [convertedPdfBytes, setConvertedPdfBytes] = useState<Uint8Array | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fitOption, setFitOption] = useState<ImageFitOption>(ImageFitOption.FIT_TO_PAGE) // Fit to page by default
  const screens = Grid.useBreakpoint()
  const isSmallScreen = !screens.md

  // Convert images to PDF
  const handleConvert = async () => {
    if (fileList.length === 0) {
      message.error(t('messages.convertError'))
      return
    }

    try {
      setIsProcessing(true)
      message.loading({
        content: t('messages.converting'),
        key: 'converting',
      })

      // Convert images to PDF
      const pdfBytesList = await convertImagesToPDFs({
        files: fileList,
        fitOption: fitOption, // Pass sizing option
        onProgress: (progress) => {
          message.loading({
            content: t('messages.convertingProgress', { progress: Math.round(progress * 100), defaultValue: `Converting: ${Math.round(progress * 100)}%` }),
            key: 'converting',
          })
        },
      })

      // If multiple PDFs are generated, merge them
      let finalPdfBytes: Uint8Array
      if (pdfBytesList.length > 1) {
        message.loading({
          content: t('messages.merging'),
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
              content: t('messages.processingProgress', { progress: Math.round(progress * 100) }),
              key: 'converting',
            })
          },
        })
      } else {
        finalPdfBytes = pdfBytesList[0]
      }

      setConvertedPdfBytes(finalPdfBytes)
      message.success({
        content: t('messages.convertSuccess'),
        key: 'converting',
      })
    } catch (error) {
      console.error('Error converting images to PDF:', error)
      const errorMessage = error instanceof Error ? error.message : t('messages.convertError')
      message.error({
        content: errorMessage,
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
        title={t('messages.convertSuccess')}
        downloadButtonText={t('downloadConvertedPDF')}
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
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(t('messages.onlyJpgPng'));
        return false;
      }
      return true;
    }
  }

  return (
    <PageLayout sider={!isSmallScreen ? siderContent : undefined}>
      {fileList.length === 0 ? (
        <EmptyState
          uploadProps={enhancedUploadProps}
          title={t('imageToPdf.title')}
          description={t('imageToPdf.description')}
          uploadHint={t('uploadText.default')}
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
            <ImageGridSortableList
              files={fileList}
              onFilesChange={setFileList}
              onRemoveFile={removeFile}
              showDeleteButton={true}
            />
          </div>
          
          {/* Bottom controls area with options and convert button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Image size options - left side */}
            <div>
              <Typography.Title level={3}>{t('imageToPdf.fitOptions')}</Typography.Title>
              <Radio.Group 
                value={fitOption} 
                onChange={(e) => setFitOption(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value={ImageFitOption.FIT_TO_PAGE}>
                    <Space align="start">
                      <span>{t('imageToPdf.fitToPage', 'Fit to Page')}</span>
                    <Typography.Text type="secondary">{t('imageToPdf.fitToPageDesc')}</Typography.Text>
                    </Space>
                  </Radio>
                  <Radio value={ImageFitOption.ORIGINAL}>
                    <Space align="start">
                      <span>{t('imageToPdf.originalSize', 'Original Size')}</span>
                    <Typography.Text type="secondary">{t('imageToPdf.originalSizeDesc')}</Typography.Text>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                size="large"
                disabled={fileList.length === 0 || isProcessing}
                onClick={handleConvert}
                loading={isProcessing}
              >
                {t('buttons.convertToPdf')}
              </Button>
            </div>
          </div>
          {/* Floating upload button for adding more files */}
          <FloatingUploadButton
            uploadProps={enhancedUploadProps}
            tooltipText={t('addMoreFiles')}
            badgeCount={fileList.length}
            position={{ right: '24px', bottom: '24px' }}
          />
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
