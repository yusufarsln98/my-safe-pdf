import type { UploadFile } from 'antd'

export interface CustomFile extends File {
	uid: string
	lastModifiedDate: Date
}

export interface PDFInfo {
	numPages?: number
	fileSize?: string
	fileName?: string
}

export type SortableItem = UploadFile & {
	id: string
	chosen: boolean
	selected: boolean
}
