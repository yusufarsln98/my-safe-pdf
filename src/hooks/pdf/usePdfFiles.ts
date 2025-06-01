import type { UploadProps, UploadFile } from 'antd'
import { message } from 'antd'
import { useState, useCallback } from 'react'

export interface UsePdfFilesOptions {
	maxFiles?: number
	maxFileSize?: number // in bytes
	onMaxFilesReached?: () => void
	onInvalidFileType?: (filename: string) => void
	onFileSizeExceeded?: (filename: string, size: number) => void
}

export interface UsePdfFilesResult {
	fileList: UploadFile[]
	setFileList: (files: UploadFile[]) => void
	uploadProps: UploadProps
	moveFile: (dragIndex: number, direction: 'up' | 'down') => void
	removeFile: (index: number) => void
	clearFiles: () => void
	isMaxFilesReached: boolean
}

export const usePdfFiles = ({
	maxFiles = Infinity,
	maxFileSize = Infinity,
	onMaxFilesReached,
	onInvalidFileType,
	onFileSizeExceeded,
}: UsePdfFilesOptions = {}): UsePdfFilesResult => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const removeFile = useCallback((index: number) => {
		setFileList((prevFiles) => {
			const newFileList = [...prevFiles]
			newFileList.splice(index, 1)
			return newFileList
		})
	}, [])

	const clearFiles = useCallback(() => {
		setFileList([])
	}, [])

	const moveFile = useCallback(
		(dragIndex: number, direction: 'up' | 'down') => {
			const hoverIndex = direction === 'up' ? dragIndex - 1 : dragIndex + 1

			setFileList((prevFileList) => {
				const newFileList = [...prevFileList]
				const dragItem = newFileList[dragIndex]
				newFileList.splice(dragIndex, 1)
				newFileList.splice(hoverIndex, 0, dragItem)
				return newFileList
			})
		},
		[]
	)

	const isMaxFilesReached = fileList.length >= maxFiles

	const uploadProps: UploadProps = {
		accept: '.pdf',
		multiple: maxFiles > 1,
		fileList,
		beforeUpload: (file) => {
			// Check file type
			if (file.type !== 'application/pdf') {
				onInvalidFileType?.(file.name)
				message.error(`${file.name} is not a PDF file!`)
				return false
			}

			// Check file size
			if (file.size > maxFileSize) {
				onFileSizeExceeded?.(file.name, file.size)
				message.error(
					`${file.name} exceeds the maximum file size of ${Math.round(
						maxFileSize / 1024 / 1024
					)}MB!`
				)
				return false
			}

			// Check max files
			if (fileList.length >= maxFiles) {
				onMaxFilesReached?.()
				message.error(`Maximum number of files (${maxFiles}) reached!`)
				return false
			}

			return false // Prevent automatic upload
		},
		onChange: ({ fileList: newFileList }) => {
			setFileList(newFileList)
		},
	}

	return {
		fileList,
		setFileList,
		uploadProps,
		moveFile,
		removeFile,
		clearFiles,
		isMaxFilesReached,
	}
}
