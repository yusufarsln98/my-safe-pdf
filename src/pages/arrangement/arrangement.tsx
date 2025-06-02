import { Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout } from '@/layout/page-layout'
import { usePdfPageCount } from '@/hooks/usePdfPageCount'
import { GridSortablePdfList } from '@/components/features/pdf'
import { splitPDF } from '@/utils/pdf/splitUtils'
import { mergePDFs, downloadPDF } from '@/utils/pdf/mergeUtils'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import type { UploadFile } from 'antd/es/upload/interface'
import { ArrangementSider } from './components/arrangement-sider'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ArrangeProps {}

export const Arrangement: React.FC<ArrangeProps> = () => {
	const { fileList, uploadProps } = usePdfFiles({
		maxFiles: 1,
	})
	const [arrangedPdfBytes, setArrangedPdfBytes] = useState<Uint8Array | null>(
		null
	)
	const totalPages = usePdfPageCount(fileList[0])
	const [splitPages, setSplitPages] = useState<Uint8Array[]>([])
	const [splitFileList, setSplitFileList] = useState<UploadFile[]>([])

	useEffect(() => {
		const handleSplitToPages = async () => {
			if (fileList.length > 0 && totalPages > 0) {
				try {
					message.loading({
						content: 'Processing PDF pages...',
						key: 'splitting',
					})

					// Create ranges for each individual page
					const ranges = Array.from({ length: totalPages }, (_, i) => ({
						from: i + 1,
						to: i + 1,
					}))

					const pdfBytesList = await splitPDF({
						file: fileList[0],
						ranges,
						onProgress: (progress) => {
							message.loading({
								content: `Processing PDF pages... ${Math.round(progress * 100)}%`,
								key: 'splitting',
							})
						},
					})

					setSplitPages(pdfBytesList)

					// Create file list for the grid
					const newFileList = pdfBytesList.map((bytes, index) => {
						const blob = new Blob([bytes], { type: 'application/pdf' })
						const uid = `page-${index + 1}`

						return {
							uid,
							name: `Page ${index + 1}`,
							type: 'application/pdf',
							size: blob.size,
							originFileObj: new File([blob], `${uid}.pdf`, {
								type: 'application/pdf',
								lastModified: Date.now(),
							}),
						} as UploadFile
					})

					setSplitFileList(newFileList)
					message.success({
						content: 'PDF pages processed successfully!',
						key: 'splitting',
					})
				} catch (error) {
					console.error('Error processing PDF:', error)
					message.error({
						content: 'Error processing PDF pages.',
						key: 'splitting',
					})
				}
			} else {
				setSplitPages([])
				setSplitFileList([])
			}
		}

		handleSplitToPages()
	}, [fileList, totalPages])

	const handleRemovePage = (index: number) => {
		const newSplitPages = [...splitPages]
		newSplitPages.splice(index, 1)
		setSplitPages(newSplitPages)

		const newFileList = [...splitFileList]
		newFileList.splice(index, 1)
		setSplitFileList(newFileList)
	}

	const handleArrange = async () => {
		try {
			message.loading({
				content: 'Arranging PDF pages...',
				key: 'arranging',
			})

			// Create a new array of files based on the current order
			const orderedFiles = splitFileList.map((file) => ({
				...file,
				originFileObj: file.originFileObj,
			}))

			const mergedPdfBytes = await mergePDFs({
				files: orderedFiles,
				onProgress: (progress) => {
					message.loading({
						content: `Arranging PDF pages... ${Math.round(progress * 100)}%`,
						key: 'arranging',
					})
				},
			})

			setArrangedPdfBytes(mergedPdfBytes)
			message.success({
				content: 'PDF pages arranged successfully!',
				key: 'arranging',
			})
		} catch (error) {
			console.error('Error arranging PDF:', error)
			message.error({
				content: 'Error arranging PDF pages.',
				key: 'arranging',
			})
		}
	}

	const handleDownload = () => {
		if (arrangedPdfBytes && fileList[0]) {
			const originalName = fileList[0].name
			downloadPDF({
				pdfBytes: arrangedPdfBytes,
				filename: `${originalName.replace('.pdf', '')}_arranged.pdf`,
			})
		}
	}

	const handleBack = () => {
		setArrangedPdfBytes(null)
	}

	if (arrangedPdfBytes) {
		return (
			<SuccessScreen
				onBack={handleBack}
				onDownload={handleDownload}
				pdfBytes={arrangedPdfBytes}
				title='PDF pages arranged successfully!'
				downloadButtonText='Download Arranged PDF'
			/>
		)
	}

	return (
		<PageLayout sider={fileList.length > 0 ? <ArrangementSider /> : undefined}>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title='Arrange PDF Pages'
					description='Rearrange PDF pages with simple drag-and-drop, delete pages, and rotate pages.'
					uploadHint='You can select single file'
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
							files={splitFileList}
							onFilesChange={setSplitFileList}
							onRemoveFile={handleRemovePage}
							showDeleteButton={true}
						/>
					</div>
					<Button
						type='primary'
						size='large'
						disabled={splitFileList.length === 0}
						onClick={handleArrange}
					>
						Arrange Pages
					</Button>
				</div>
			)}
		</PageLayout>
	)
}
