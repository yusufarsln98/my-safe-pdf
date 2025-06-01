import { useState } from 'react'
import type { UploadProps, UploadFile } from 'antd'
import { message } from 'antd'

export const usePdfFiles = () => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	const removeFile = (index: number) => {
		const newFileList = [...fileList]
		newFileList.splice(index, 1)
		setFileList(newFileList)
	}

	const uploadProps: UploadProps = {
		accept: '.pdf',
		multiple: true,
		fileList,
		beforeUpload: (file) => {
			if (file.type !== 'application/pdf') {
				message.error(`${file.name} bir PDF dosyası değil!`)
				return false
			}
			return false
		},
		onChange: ({ fileList: newFileList }) => {
			setFileList(newFileList)
		},
	}

	const moveFile = (dragIndex: number, direction: 'up' | 'down') => {
		const hoverIndex = direction === 'up' ? dragIndex - 1 : dragIndex + 1

		setFileList((prevFileList) => {
			const newFileList = [...prevFileList]
			const dragItem = newFileList[dragIndex]
			newFileList.splice(dragIndex, 1)
			newFileList.splice(hoverIndex, 0, dragItem)
			return newFileList
		})
	}

	return {
		fileList,
		setFileList,
		uploadProps,
		moveFile,
		removeFile,
	}
}
