import { Button, message, Grid } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrangementSider } from './components/arrangement-sider'
import { GridSortablePdfList } from '@/components/features/pdf'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingSettingsButton } from '@/components/ui/floating-settings-button'
import { usePdfFiles } from '@/hooks/pdf'
import { usePdfPageCount } from '@/hooks/usePdfPageCount'
import { PageLayout, ResponsiveSidebarDrawer } from '@/layout/page-layout'
import { mergePDFs, downloadPDF } from '@/utils/pdf/mergeUtils'
import { splitPDF } from '@/utils/pdf/splitUtils'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ArrangeProps {}

export const Arrangement: React.FC<ArrangeProps> = () => {
	const { fileList, uploadProps, setFileList } = usePdfFiles({
		maxFiles: 1,
	})
	const [arrangedPdfBytes, setArrangedPdfBytes] = useState<Uint8Array | null>(
		null
	)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const screens = Grid.useBreakpoint()
	const isSmallScreen = !screens.md
	const totalPages = usePdfPageCount(fileList[0])
	const [splitPages, setSplitPages] = useState<Uint8Array[]>([])
	const [splitFileList, setSplitFileList] = useState<UploadFile[]>([])
	const { t } = useTranslation()

	useEffect(() => {
		const handleSplitToPages = async () => {
			if (fileList.length > 0 && totalPages > 0) {
				try {
					message.loading({
						content: t('messages.processing'),
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
								content: `${t('messages.processingProgress', { progress: Math.round(progress * 100) })}`,
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
						content: t('messages.processSuccess'),
						key: 'splitting',
					})
				} catch (error) {
					console.error('Error processing PDF:', error)
					message.error({
						content: t('messages.processError'),
						key: 'splitting',
					})
				}
			} else {
				setSplitPages([])
				setSplitFileList([])
			}
		}

		handleSplitToPages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fileList, totalPages])

	const handleRemovePage = (index: number) => {
		const newSplitPages = [...splitPages]
		newSplitPages.splice(index, 1)
		setSplitPages(newSplitPages)

		const newFileList = [...splitFileList]
		newFileList.splice(index, 1)
		setSplitFileList(newFileList)

		// if no pages left, clear the file list
		if (newSplitPages.length === 0) {
			setSplitFileList([])
			setFileList([])
		}
	}

	const handleArrange = async () => {
		try {
			message.loading({
				content: t('messages.processing'),
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
						content: `${t('messages.processingProgress', { progress: Math.round(progress * 100) })}`,
						key: 'arranging',
					})
				},
			})

			setArrangedPdfBytes(mergedPdfBytes)
			message.success({
				content: t('messages.arrangeSuccess'),
				key: 'arranging',
			})
		} catch (error) {
			console.error('Error arranging PDF:', error)
			message.error({
				content: t('messages.processError'),
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
		setFileList([])
		setSplitPages([])
		setSplitFileList([])
	}

	if (arrangedPdfBytes) {
		return (
			<SuccessScreen
				onBack={handleBack}
				onDownload={handleDownload}
				pdfBytes={arrangedPdfBytes}
				title={t('messages.arrangeSuccess')}
				downloadButtonText={t('downloadArrangedPDF')}
			/>
		)
	}

	const siderContent =
		fileList.length > 0 ? <ArrangementSider onBack={handleBack} /> : undefined

	return (
		<PageLayout sider={!isSmallScreen ? siderContent : undefined}>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title={t('arrangement.title')}
					description={t('arrangement.description')}
					uploadHint={t('uploadText.singleFile')}
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
						{t('buttons.arrangePages')}
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
