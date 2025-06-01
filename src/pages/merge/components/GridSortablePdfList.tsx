import React, { useMemo } from 'react'
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
import { PDFThumbnail } from './PDFThumbnail'

interface GridSortablePdfListProps {
	files: UploadFile[]
	onFilesChange: (files: UploadFile[]) => void
	onRemoveFile: (index: number) => void
	showMergeButton?: boolean
}

// Extend UploadFile to include required sortable properties
type SortableItem = UploadFile & {
	id: string
	chosen: boolean
	selected: boolean
}

const GridItemComponent = React.memo(
	({
		file,
		index,
		onRemove,
	}: {
		file: SortableItem
		index: number
		onRemove: (index: number) => void
	}) => {
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

		return (
			<StyledGridItem>
				<DeleteButton
					className='delete-button ignoreDrag'
					type='text'
					size='small'
					danger
					icon={<DeleteOutlined />}
					onClick={() => onRemove(index)}
				/>
				<ThumbnailWrapper>
					<PDFThumbnail file={pdfFile} />
				</ThumbnailWrapper>
				<FileInfo>
					<FileName>{file.name}</FileName>
					<FileSize>{`${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}</FileSize>
				</FileInfo>
			</StyledGridItem>
		)
	}
)

export const GridSortablePdfList: React.FC<GridSortablePdfListProps> = ({
	files,
	onFilesChange,
	onRemoveFile,
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

	const onDragDropEnds = (oldIndex: number, newIndex: number) => {
		console.log('Drag and drop ended:', { oldIndex, newIndex })
	}

	return (
		<Flex
			vertical
			gap={24}
			style={{ width: '100%', height: '100%' }}
		>
			<GlobalStyle />
			<ReactSortable
				list={sortableFiles}
				setList={handleSortableChange}
				ghostClass='dropArea'
				filter='.ignoreDrag'
				preventOnFilter={true}
				className='grid-container'
				onEnd={({ oldIndex, newIndex }) => {
					if (oldIndex !== undefined && newIndex !== undefined) {
						onDragDropEnds(oldIndex, newIndex)
					}
				}}
			>
				{sortableFiles.map((file, index) => (
					<GridItemComponent
						key={file.uid}
						file={file}
						index={index}
						onRemove={onRemoveFile}
					/>
				))}
			</ReactSortable>
		</Flex>
	)
}
