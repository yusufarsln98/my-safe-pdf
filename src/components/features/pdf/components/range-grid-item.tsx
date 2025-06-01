import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
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

const PreviewContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

const EllipsisIcon = styled(EllipsisOutlined)`
	color: ${(props) => props.theme.colorTextSecondary};
	font-size: 24px;
`

interface GridItemProps {
	file: SortableItem
	index: number
	onRemove: (index: number) => void
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
	startingPage?: number
	endingPage?: number
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

		if (!pdfFile) return null

		const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
			setPdfInfo((prev) => ({ ...prev, numPages }))
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
					</ThumbnailWrapper>
					<EllipsisIcon />
					<ThumbnailWrapper>
						<PDFThumbnail
							pageNumber={endingPage}
							file={pdfFile}
							onLoadSuccess={handleLoadSuccess}
						/>
					</ThumbnailWrapper>
				</PreviewContainer>
				{renderCustomFileInfo ? (
					renderCustomFileInfo(file)
				) : (
					<FileInfo>
						<FileName>{file.name}</FileName>
						<FileSize>
							{pdfInfo.fileSize}
							{pdfInfo.numPages && ` • ${pdfInfo.numPages} pages`}
						</FileSize>
					</FileInfo>
				)}
			</StyledRangeGridItem>
		)
	}
)
