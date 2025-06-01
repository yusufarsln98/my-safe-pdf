import React from 'react'
import { Button, Typography, Flex } from 'antd'
import type { UploadFile } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { ReactSortable } from 'react-sortablejs'
import {
	GlobalStyle,
	GridItem,
	ThumbnailWrapper,
	FileInfo,
	FileName,
	FileSize,
	DeleteButton,
} from './GridSortablePdfList.styles'
import { PDFThumbnail } from './PDFThumbnail'

const { Title } = Typography

interface GridSortablePdfListProps {
	files: UploadFile[]
	onFilesChange: (files: UploadFile[]) => void
	onRemoveFile: (index: number) => void
}

// Extend UploadFile to include required sortable properties
type SortableItem = UploadFile & {
	id: string
	chosen: boolean
	selected: boolean
}

export const GridSortablePdfList: React.FC<GridSortablePdfListProps> = ({
	files,
	onFilesChange,
	onRemoveFile,
}) => {
	if (files.length === 0) return null

	// Convert UploadFile array to SortableItem array
	const sortableFiles: SortableItem[] = files.map((file) => ({
		...file,
		id: file.uid,
		chosen: false,
		selected: false,
	}))

	const handleSortableChange = (newState: SortableItem[]) => {
		// Convert back to UploadFile array by copying only UploadFile properties
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
		>
			<GlobalStyle />
			<Title level={4}>Yüklenen Dosyalar</Title>
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
					<GridItem key={file.uid}>
						<DeleteButton
							className='delete-button ignoreDrag'
							type='text'
							size='small'
							danger
							icon={<DeleteOutlined />}
							onClick={() => onRemoveFile(index)}
						/>
						<ThumbnailWrapper>
							<PDFThumbnail
								file={
									file.originFileObj || {
										url:
											file.url || URL.createObjectURL(file as unknown as Blob),
									}
								}
							/>
						</ThumbnailWrapper>
						<FileInfo>
							<FileName>{file.name}</FileName>
							<FileSize>{`${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}</FileSize>
						</FileInfo>
					</GridItem>
				))}
			</ReactSortable>

			<Button
				type='primary'
				size='large'
				disabled={files.length < 2}
			>
				PDF'leri Birleştir
			</Button>
		</Flex>
	)
}
