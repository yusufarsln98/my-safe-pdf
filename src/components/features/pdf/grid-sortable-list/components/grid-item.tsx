import { DeleteOutlined, RotateRightOutlined } from '@ant-design/icons'
import { App, Tooltip } from 'antd'
import type { UploadFile } from 'antd'
import React, { useMemo, useState } from 'react'
import {
	GridItem as StyledGridItem,
	ThumbnailWrapper,
	FileInfo,
	FileName,
	FileSize,
	ActionButton,
	ActionButtons,
} from '../grid-sortable-pdf-list.styles'
import type { CustomFile, PDFInfo, SortableItem } from '../types'
import { formatFileSize } from '../utils'
import { PDFThumbnail } from '@/components/ui/pdf-thumbnail'
import { rotatePDF } from '@/utils/pdf'

interface GridItemProps {
	file: SortableItem
	index: number
	onRemove: (index: number) => void
	onFilesChange: (files: UploadFile[]) => void
	files: UploadFile[]
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
}

export const GridItem = React.memo(
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
					<Tooltip title='Rotate'>
						<ActionButton
							variant='filled'
							color='blue'
							size='small'
							icon={<RotateRightOutlined spin={isRotating} />}
							onClick={handleRotate}
						/>
					</Tooltip>
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
