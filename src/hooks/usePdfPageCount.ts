import { UploadFile } from 'antd'
import { useEffect, useState } from 'react'
import { getPdfPageCountWithPdfJs } from '@/pages/split/utils/split-utils'

export const usePdfPageCount = (file: UploadFile) => {
	const [totalPages, setTotalPages] = useState<number>(0)

	useEffect(() => {
		const extractPageCount = async () => {
			if (file?.originFileObj) {
				try {
					const pageCount = await getPdfPageCountWithPdfJs(file.originFileObj)
					setTotalPages(pageCount)
				} catch (error) {
					console.error('Error getting PDF page count:', error)
					setTotalPages(0)
				}
			} else {
				setTotalPages(0)
			}
		}

		extractPageCount()
	}, [file])

	return totalPages
}
