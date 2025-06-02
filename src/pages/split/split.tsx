import { Button, message, Grid, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { SplitSider } from './components/split-sider'
import { RangeGridItem } from '@/components/features/pdf'
import { SuccessScreen } from '@/components/features/pdf/success-screen'
import { EmptyState } from '@/components/ui/empty-state'
import { FloatingSettingsButton } from '@/components/ui/floating-settings-button'
import { usePdfFiles } from '@/hooks/pdf'
import { usePdfPageCount } from '@/hooks/usePdfPageCount'
import { PageLayout, ResponsiveSidebarDrawer } from '@/layout/page-layout'
import { splitPDF, downloadSplitPDFs } from '@/utils/pdf/splitUtils'

interface PageRange {
	from: number
	to: number
}

interface RangeFormValue {
	ranges: PageRange[]
}

const StyledGridContainer = styled.div`
	display: flex;
	gap: 16px;
	min-height: calc(100vh - 136px);
	flex-wrap: wrap;
`

export const Split: React.FC = () => {
	const [form] = Form.useForm<RangeFormValue>()
	const [ranges, setRanges] = useState<PageRange[]>([])
	const [splitPdfBytes, setSplitPdfBytes] = useState<Uint8Array[] | null>(null)
	const { fileList, uploadProps, setFileList } = usePdfFiles({
		maxFiles: 1,
	})
	const [drawerVisible, setDrawerVisible] = useState(false)
	const screens = Grid.useBreakpoint()
	const isSmallScreen = !screens.md
	const totalPages = usePdfPageCount(fileList[0])
	const { t } = useTranslation()

	const onRangesChange = (values: RangeFormValue) => {
		setRanges(values.ranges)
	}

	useEffect(() => {
		if (totalPages > 0) {
			setRanges([{ from: 1, to: totalPages }])
		}
	}, [totalPages])

	const onRemove = (index: number) => {
		const newRanges = ranges.filter((_, i) => i !== index)
		setRanges(newRanges)
		form.setFieldsValue({ ranges: newRanges })
		if (newRanges.length === 0) {
			setFileList([])
		}
	}

	const handleSplit = async () => {
		try {
			message.loading({
				content: t('messages.splitting'),
				key: 'splitting',
			})
			const pdfBytesList = await splitPDF({
				file: fileList[0],
				ranges,
				onProgress: (progress) => {
					message.loading({
						content: `${t('messages.splitting')} ${Math.round(progress * 100)}%`,
						key: 'splitting',
					})
				},
			})
			setSplitPdfBytes(pdfBytesList)
			message.success({
				content: t('messages.splitSuccess'),
				key: 'splitting',
			})
		} catch (error) {
			console.error('Error splitting PDF:', error)
			message.error({
				content: t('messages.splitError'),
				key: 'splitting',
			})
		}
	}

	const handleDownload = () => {
		if (splitPdfBytes && fileList[0]) {
			downloadSplitPDFs(splitPdfBytes, fileList[0].name)
		}
	}

	const handleBack = () => {
		setSplitPdfBytes(null)
	}

	const handleClearAll = () => {
		setFileList([])
		setRanges([])
	}

	if (splitPdfBytes) {
		return (
			<SuccessScreen
				onBack={handleBack}
				onDownload={handleDownload}
				pdfBytes={splitPdfBytes[0]}
				title={t('messages.splitSuccess')}
				hidePreview={true}
				downloadButtonText={
					splitPdfBytes.length > 1 ? t('downloadZip') : t('downloadSplitPDF')
				}
			/>
		)
	}

	const siderContent =
		fileList.length > 0 ? (
			<SplitSider
				totalPages={totalPages}
				onRangesChange={onRangesChange}
				onBack={handleClearAll}
				form={form}
			/>
		) : undefined

	return (
		<PageLayout sider={!isSmallScreen ? siderContent : undefined}>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title={t('split.title')}
					description={t('split.description')}
					uploadHint={t('uploadText.singleFile')}
				/>
			) : (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<StyledGridContainer>
						{ranges.map((range, index) => (
							<RangeGridItem
								key={index}
								file={fileList[0]}
								index={index}
								onRemove={onRemove}
								startingPage={range.from}
								endingPage={range.to}
							/>
						))}
					</StyledGridContainer>
					<Button
						type='primary'
						size='large'
						disabled={ranges.length === 0}
						style={{ width: '100%', marginTop: 'auto' }}
						onClick={handleSplit}
					>
						{t('buttons.splitPdf')}
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
