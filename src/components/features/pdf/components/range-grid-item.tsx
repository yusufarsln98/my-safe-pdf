import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'
import type { UploadFile } from 'antd'
import React, { useMemo, useState } from 'react'
import {
	FileInfo,
	FileName,
	FileSize,
	ActionButton,
	ActionButtons,
} from './grid-item.styles'
import type { PDFInfo, SortableItem } from '../grid-sortable-list/types'
import { formatFileSize } from '../grid-sortable-list/utils'
import { PDFThumbnail } from '@/components/ui/pdf-thumbnail'
import styled from 'styled-components'
import { StyledRangeGridItem, ThumbnailWrapper } from './range-grid-item.styles'

const { Text } = Typography

const PreviewContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

const PageNumber = styled(Text)`
	color: ${(props) => props.theme.colorTextSecondary};
	font-size: 12px;
`

const EllipsisIcon = styled(EllipsisOutlined)`
	color: ${(props) => props.theme.colorTextSecondary};
	font-size: 24px;
`

interface GridItemProps {
	file: SortableItem | UploadFile
	index: number
	onRemove: (index: number) => void
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
	startingPage?: number
	endingPage?: number
	onLoadSuccess?: ({ numPages }: { numPages: number }) => void
}

export const RangeGridItem = React.memo(
	({
		file,
		index,
		onRemove,
		showDeleteButton = true,
		renderCustomFileInfo,
		startingPage = 1,
		endingPage = 1,
		onLoadSuccess,
	}: GridItemProps) => {
		const [pdfInfo, setPdfInfo] = useState<PDFInfo>({
			fileName: file.name,
			fileSize: formatFileSize(file.size || 0),
		})

		const pdfFile = useMemo(() => {
			// First try to get the actual File object
			if (file.originFileObj) {
				return file.originFileObj as File
			}
			// If we have a URL, use that
			if (file.url) {
				return { url: file.url }
			}
			// If we have a thumbUrl, use that as a fallback
			if (file.thumbUrl) {
				return { url: file.thumbUrl }
			}
			console.error('No valid file source found:', file)
			return null
		}, [file])

		const isSamePage = startingPage === endingPage

		if (!pdfFile) return null

		const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
			setPdfInfo((prev) => ({ ...prev, numPages }))
			onLoadSuccess?.({ numPages })
		}

		return (
			<StyledRangeGridItem>
				<ActionButtons className='action-buttons ignoreDrag'>
					{showDeleteButton && (
						<Tooltip title='Delete'>
							<ActionButton
								variant='filled'
								color='red'
								size='small'
								icon={<DeleteOutlined />}
								onClick={() => onRemove(index)}
							/>
						</Tooltip>
					)}
				</ActionButtons>
				<PreviewContainer>
					<ThumbnailWrapper>
						<PDFThumbnail
							pageNumber={startingPage}
							file={pdfFile}
							onLoadSuccess={handleLoadSuccess}
						/>
						<PageNumber>{startingPage}</PageNumber>
					</ThumbnailWrapper>
					{!isSamePage && (
						<>
							<EllipsisIcon />
							<ThumbnailWrapper>
								<PDFThumbnail
									pageNumber={endingPage}
									file={pdfFile}
									onLoadSuccess={handleLoadSuccess}
								/>
								<PageNumber>{endingPage}</PageNumber>
							</ThumbnailWrapper>
						</>
					)}
				</PreviewContainer>
				{renderCustomFileInfo ? (
					renderCustomFileInfo(file)
				) : (
					<FileInfo>
						<FileName>{file.name}</FileName>
						<FileSize>
							{pdfInfo.fileSize} - [{startingPage} - {endingPage}]
						</FileSize>
					</FileInfo>
				)}
			</StyledRangeGridItem>
		)
	}
)
