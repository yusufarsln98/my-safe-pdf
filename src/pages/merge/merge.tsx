import { Button, message } from 'antd'
import React, { useState } from 'react'
import { MergeSider } from './components/merge-sider'
import { GridSortablePdfList } from '@/components/features/pdf'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingUploadButton } from '@/components/ui/floating-upload-button'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout } from '@/layout/page-layout'
import { mergePDFs, downloadPDF } from '@/utils/pdf'

export const Merge: React.FC = () => {
	const { fileList, uploadProps, removeFile, setFileList } = usePdfFiles()
	const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null)

	const handleMerge = async () => {
		try {
			message.loading({
				content: 'Merging PDF files...',
				key: 'merging',
			})
			const pdfBytes = await mergePDFs({ files: fileList })
			setMergedPdfBytes(pdfBytes)
			message.success({
				content: 'PDF files merged successfully!',
				key: 'merging',
			})
		} catch (error) {
			console.error('Error merging PDFs:', error)
			message.error({
				content: 'Error merging PDF files.',
				key: 'merging',
			})
		}
	}

	const handleDownload = () => {
		if (mergedPdfBytes) {
			downloadPDF({ pdfBytes: mergedPdfBytes })
		}
	}

	const handleBack = () => {
		setMergedPdfBytes(null)
	}

	const handleClearAll = () => {
		setFileList([])
	}

	if (mergedPdfBytes) {
		return (
			<SuccessScreen
				onBack={handleBack}
				onDownload={handleDownload}
				pdfBytes={mergedPdfBytes}
				title='PDF files merged successfully!'
				downloadButtonText='Download Merged PDF'
				hidePreview={false}
			/>
		)
	}

	return (
		<PageLayout
			sider={
				fileList.length > 0 ? <MergeSider onBack={handleClearAll} /> : undefined
			}
		>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title='Merge PDFs'
					description='Merge multiple PDF files into one. Drag and drop or select files, reorder them, and merge.'
				/>
			) : (
				<>
					<GridSortablePdfList
						files={fileList}
						onFilesChange={setFileList}
						onRemoveFile={removeFile}
					/>
					<Button
						type='primary'
						size='large'
						disabled={fileList.length < 2}
						style={{ width: '100%', marginTop: '24px' }}
						onClick={handleMerge}
					>
						Merge PDFs
					</Button>
				</>
			)}
			{fileList.length > 0 && (
				<FloatingUploadButton
					uploadProps={uploadProps}
					badgeCount={fileList.length}
					tooltipText='Add more files'
				/>
			)}
		</PageLayout>
	)
}
