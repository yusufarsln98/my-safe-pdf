import React, { useMemo, useState } from 'react'
import { Flex } from 'antd'
import type { UploadFile } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { ReactSortable } from 'react-sortablejs'
import {
	GlobalStyle,
	GridItem as StyledGridItem,
	ThumbnailWrapper,
	FileInfo,
	FileName,
	FileSize,
	DeleteButton,
} from './GridSortablePdfList.styles'
import { PDFThumbnail } from '../../../ui/pdf-thumbnail'

export interface GridSortablePdfListProps {
	files: UploadFile[]
	onFilesChange: (files: UploadFile[]) => void
	onRemoveFile: (index: number) => void
	onDragEnd?: (oldIndex: number, newIndex: number) => void
	gridGap?: number
	minColumnWidth?: number
	itemHeight?: number
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
}

// Extend UploadFile to include required sortable properties
type SortableItem = UploadFile & {
	id: string
	chosen: boolean
	selected: boolean
}

interface GridItemProps {
	file: SortableItem
	index: number
	onRemove: (index: number) => void
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
}

interface PDFInfo {
	numPages?: number
	fileSize?: string
	fileName?: string
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const GridItemComponent = React.memo(
	({
		file,
		index,
		onRemove,
		showDeleteButton = true,
		renderCustomFileInfo,
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
			<StyledGridItem>
				{showDeleteButton && (
					<DeleteButton
						className='delete-button ignoreDrag'
						type='text'
						size='small'
						danger
						icon={<DeleteOutlined />}
						onClick={() => onRemove(index)}
					/>
				)}
				<ThumbnailWrapper>
					<PDFThumbnail
						file={pdfFile}
						onLoadSuccess={handleLoadSuccess}
					/>
				</ThumbnailWrapper>
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
			</StyledGridItem>
		)
	}
)

export const GridSortablePdfList: React.FC<GridSortablePdfListProps> = ({
	files,
	onFilesChange,
	onRemoveFile,
	onDragEnd,
	gridGap = 16,
	minColumnWidth = 200,
	itemHeight = 280,
	showDeleteButton = true,
	renderCustomFileInfo,
}) => {
	const sortableFiles: SortableItem[] = useMemo(
		() =>
			files.map((file) => ({
				...file,
				id: file.uid,
				chosen: false,
				selected: false,
			})),
		[files]
	)

	if (files.length === 0) return null

	const handleSortableChange = (newState: SortableItem[]) => {
		const newFiles = newState.map((item) => {
			const uploadFile: UploadFile = Object.assign({}, item)
			return uploadFile
		})
		onFilesChange(newFiles)
	}

	return (
		<Flex
			vertical
			gap={24}
			style={{ width: '100%', height: '100%' }}
		>
			<GlobalStyle
				gridGap={gridGap}
				minColumnWidth={minColumnWidth}
				itemHeight={itemHeight}
			/>
			<ReactSortable
				list={sortableFiles}
				setList={handleSortableChange}
				ghostClass='dropArea'
				filter='.ignoreDrag'
				preventOnFilter={true}
				className='grid-container'
				onEnd={({ oldIndex, newIndex }) => {
					if (oldIndex !== undefined && newIndex !== undefined && onDragEnd) {
						onDragEnd(oldIndex, newIndex)
					}
				}}
			>
				{sortableFiles.map((file, index) => (
					<GridItemComponent
						key={file.uid}
						file={file}
						index={index}
						onRemove={onRemoveFile}
						showDeleteButton={showDeleteButton}
						renderCustomFileInfo={renderCustomFileInfo}
					/>
				))}
			</ReactSortable>
		</Flex>
	)
}
