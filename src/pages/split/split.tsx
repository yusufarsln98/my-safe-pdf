import { Flex, Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { SplitSider } from './components/split-sider'
import { EmptyState } from '@/components/ui/empty-state'
import { usePdfFiles } from '@/hooks/pdf'
import { PageLayout } from '@/layout/page-layout'
import { usePdfPageCount } from '@/hooks/usePdfPageCount'
import { RangeGridItem } from '@/components/features/pdf'
import { splitPDF, downloadSplitPDFs } from '@/utils/pdf/splitUtils'
import { SuccessScreen } from '@/components/features/pdf/success-screen'

interface PageRange {
	from: number
	to: number
}

interface RangeFormValue {
	ranges: PageRange[]
}

export const Split: React.FC = () => {
	const [ranges, setRanges] = useState<PageRange[]>([])
	const [splitPdfBytes, setSplitPdfBytes] = useState<Uint8Array[] | null>(null)
	const { fileList, uploadProps } = usePdfFiles({
		maxFiles: 1,
	})
	const totalPages = usePdfPageCount(fileList[0])

	const onRangesChange = (values: RangeFormValue) => {
		setRanges(values.ranges)
	}

	useEffect(() => {
		if (totalPages > 0) {
			setRanges([{ from: 1, to: totalPages }])
		}
	}, [totalPages])

	const onRemove = (index: number) => {
		setRanges(ranges.filter((_, i) => i !== index))
	}

	const handleSplit = async () => {
		try {
			message.loading({
				content: 'Splitting PDF file...',
				key: 'splitting',
			})
			const pdfBytesList = await splitPDF({
				file: fileList[0],
				ranges,
				onProgress: (progress) => {
					message.loading({
						content: `Splitting PDF file... ${Math.round(progress * 100)}%`,
						key: 'splitting',
					})
				},
			})
			setSplitPdfBytes(pdfBytesList)
			message.success({
				content: 'PDF file split successfully!',
				key: 'splitting',
			})
		} catch (error) {
			console.error('Error splitting PDF:', error)
			message.error({
				content: 'Error splitting PDF file.',
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

	if (splitPdfBytes) {
		return (
			<SuccessScreen
				onBack={handleBack}
				onDownload={handleDownload}
				pdfBytes={splitPdfBytes[0]}
				title='PDF split successfully!'
				hidePreview={true}
				downloadButtonText={
					splitPdfBytes.length > 1
						? 'Download ZIP with split PDFs'
						: 'Download split PDF'
				}
			/>
		)
	}

	return (
		<PageLayout
			sider={
				fileList.length > 0 ? (
					<SplitSider
						totalPages={totalPages}
						onRangesChange={onRangesChange}
					/>
				) : undefined
			}
		>
			{fileList.length === 0 ? (
				<EmptyState
					uploadProps={uploadProps}
					title='Split PDF'
					description='Split a PDF file into multiple files. Select a PDF file to get started.'
					uploadHint='You can select single file'
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
					<Flex
						gap={24}
						style={{
							width: '100%',
							flexWrap: 'wrap',
						}}
					>
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
					</Flex>
					<Button
						type='primary'
						size='large'
						disabled={ranges.length === 0}
						style={{ width: '100%', marginTop: 'auto' }}
						onClick={handleSplit}
					>
						Split PDF
					</Button>
				</div>
			)}
		</PageLayout>
	)
}
