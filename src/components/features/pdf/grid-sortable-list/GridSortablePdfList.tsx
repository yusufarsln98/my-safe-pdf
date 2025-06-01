import { DeleteOutlined, RotateRightOutlined } from '@ant-design/icons'
import { Flex, App } from 'antd'
import type { UploadFile } from 'antd'
import React, { useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import {
	GlobalStyle,
	GridItem as StyledGridItem,
	ThumbnailWrapper,
	FileInfo,
	FileName,
	FileSize,
	ActionButton,
	ActionButtons,
} from './GridSortablePdfList.styles'
import { PDFThumbnail } from '../../../ui/pdf-thumbnail'
import { rotatePDF } from '../../../../utils/pdf'

interface CustomFile extends File {
	uid: string
	lastModifiedDate: Date
}

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
	onFilesChange: (files: UploadFile[]) => void
	files: UploadFile[]
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
		onFilesChange,
		files,
		showDeleteButton = true,
		renderCustomFileInfo,
	}: GridItemProps) => {
		const [pdfInfo, setPdfInfo] = useState<PDFInfo>({
			fileName: file.name,
			fileSize: formatFileSize(file.size || 0),
		})
		const [isRotating, setIsRotating] = useState(false)
		const { message: messageApi } = App.useApp()

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

		const handleRotate = async () => {
			try {
				setIsRotating(true)
				messageApi.loading({
					content: 'Rotating PDF...',
					key: 'rotating',
				})
				const rotatedPdfBytes = await rotatePDF({ file })

				// Create a new File object from the rotated PDF bytes
				const rotatedFile = new File([rotatedPdfBytes], file.name, {
					type: 'application/pdf',
				}) as CustomFile
				rotatedFile.uid = `${file.uid}_${Date.now()}`

				// Update the file object with the rotated PDF
				const newFile: UploadFile = {
					...file,
					originFileObj: rotatedFile,
					uid: rotatedFile.uid,
					lastModified: Date.now(),
				}

				// Replace the file in the parent component
				onFilesChange(
					files.map((f: UploadFile, i: number) => (i === index ? newFile : f))
				)

				messageApi.success({
					content: 'PDF rotated successfully!',
					key: 'rotating',
				})
			} catch (error) {
				console.error('Error rotating PDF:', error)
				messageApi.error({
					content: 'Failed to rotate PDF.',
					key: 'rotating',
				})
			} finally {
				setIsRotating(false)
			}
		}

		return (
			<StyledGridItem>
				<ActionButtons className='action-buttons ignoreDrag'>
					{showDeleteButton && (
						<ActionButton
							type='text'
							size='small'
							danger
							icon={<DeleteOutlined />}
							onClick={() => onRemove(index)}
						/>
					)}
					<ActionButton
						type='text'
						size='small'
						icon={<RotateRightOutlined spin={isRotating} />}
						onClick={handleRotate}
					/>
				</ActionButtons>
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
		const newFiles: UploadFile[] = newState.map((item) => ({
			...item,
			uid: item.id,
		}))
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
						onFilesChange={onFilesChange}
						files={files}
						showDeleteButton={showDeleteButton}
						renderCustomFileInfo={renderCustomFileInfo}
					/>
				))}
			</ReactSortable>
		</Flex>
	)
}
