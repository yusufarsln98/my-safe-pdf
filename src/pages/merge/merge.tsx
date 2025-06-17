import { Button, message, Grid } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MergeSider } from './components/merge-sider'
import { GridSortablePdfList } from '@/components/features/pdf'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingSettingsButton } from '@/components/ui/floating-settings-button'
import { FloatingUploadButton } from '@/components/ui/floating-upload-button'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout, ResponsiveSidebarDrawer } from '@/layout/page-layout'
import { mergePDFs, downloadPDF } from '@/utils/pdf'

export const Merge: React.FC = () => {
	const { fileList, uploadProps, removeFile, setFileList } = usePdfFiles()
	const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const screens = Grid.useBreakpoint()
	const isSmallScreen = !screens.md
	const { t } = useTranslation()

	const handleMerge = async () => {
		try {
			message.loading({
				content: t('messages.merging'),
				key: 'merging',
			})
			const pdfBytes = await mergePDFs({ files: fileList })
			setMergedPdfBytes(pdfBytes)
			message.success({
				content: t('messages.mergeSuccess'),
				key: 'merging',
			})
		} catch (error) {
			console.error('Error merging PDFs:', error)
			message.error({
				content: t('messages.mergeError'),
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
				title={t('messages.mergeSuccess')}
				downloadButtonText={t('downloadMergedPDF')}
				hidePreview={false}
			/>
		)
	}

	const siderContent =
		fileList.length > 0 ? <MergeSider onBack={handleClearAll} /> : undefined

	return (
		<PageLayout sider={!isSmallScreen ? siderContent : undefined}>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title={t('merge.title')}
					description={t('merge.description')}
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
						{t('buttons.mergePdfs')}
					</Button>
				</>
			)}
			{fileList.length > 0 && (
				<>
					<FloatingUploadButton
						uploadProps={uploadProps}
						badgeCount={fileList.length}
						tooltipText={t('addMoreFiles')}
					/>
					{isSmallScreen && (
						<ResponsiveSidebarDrawer
							visible={drawerVisible}
							onClose={() => setDrawerVisible(false)}
						>
							{siderContent}
						</ResponsiveSidebarDrawer>
					)}
					{isSmallScreen && fileList.length > 0 && (
						<FloatingSettingsButton onClick={() => setDrawerVisible(true)} />
					)}
				</>
			)}
		</PageLayout>
	)
}
