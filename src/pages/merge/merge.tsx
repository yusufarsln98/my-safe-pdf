import React, { useState } from 'react'
import { Alert, Typography, Button, message } from 'antd'
import { usePdfFiles } from '../../hooks/pdf'
import { EmptyState } from '../../components/ui/empty-state'
import { FloatingUploadButton } from '../../components/ui/floating-upload-button'
import { GridSortablePdfList } from '../../components/features/pdf/grid-sortable-list'
import { mergePDFs, downloadPDF } from '../../utils/pdf'
import { MergeSuccess } from '../../components/features/pdf/merge-success'
import { PageLayout, SidebarLayout } from '../../components/ui/layout'

const { Title } = Typography

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

	if (mergedPdfBytes) {
		return (
			<MergeSuccess
				onBack={handleBack}
				onDownload={handleDownload}
				mergedPdfBytes={mergedPdfBytes}
			/>
		)
	}

	const sidebarContent = (
		<SidebarLayout
			title={
				<Title
					level={5}
					style={{ margin: 0, padding: 0 }}
				>
					Merge PDFs
				</Title>
			}
		>
			<Alert
				message="Click 'Select PDF files' button again to select multiple PDF files. Hold 'Ctrl' key to select multiple files."
				type='info'
			/>
		</SidebarLayout>
	)

	return (
		<PageLayout sider={fileList.length > 0 ? sidebarContent : undefined}>
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
