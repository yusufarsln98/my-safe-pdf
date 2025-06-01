import type { Meta, StoryFn } from '@storybook/react'
import type { UploadFile, UploadProps } from 'antd'
import { RangeGridItem, SortableItem } from '@/components/features/pdf'
import { FloatingUploadButton } from '@/components/ui/floating-upload-button'
import { useState } from 'react'

type StoryProps = {
	file: SortableItem
	index: number
	onRemove: (index: number) => void
	showDeleteButton?: boolean
	renderCustomFileInfo?: (file: UploadFile) => React.ReactNode
	startingPage?: number
	endingPage?: number
}

export default {
	title: 'PDF/RangeGridItem',
	component: RangeGridItem,
	parameters: {
		docs: {
			description: {
				component:
					'A grid item component that displays a range of pages from a PDF file with thumbnails and an ellipsis between them.',
			},
		},
	},
	tags: ['autodocs'],
} as Meta<typeof RangeGridItem>

const InteractiveTemplate: StoryFn<StoryProps> = (args) => {
	const [currentFile, setCurrentFile] = useState<SortableItem>(args.file)
	const uploadProps: UploadProps = {
		accept: '.pdf',
		beforeUpload: (file) => {
			// Create a URL for the uploaded file
			const url = URL.createObjectURL(file)

			// Create a new SortableItem from the uploaded file
			const newFile: SortableItem = {
				uid: file.uid,
				name: file.name,
				status: 'done',
				size: file.size,
				type: file.type,
				url: url,
				id: file.uid,
				chosen: false,
				selected: false,
			}

			setCurrentFile(newFile)
			return false // Prevent default upload behavior
		},
		maxCount: 1,
		showUploadList: false,
	}

	return (
		<div style={{ width: '400px', position: 'relative', height: '300px' }}>
			{currentFile && (
				<RangeGridItem
					{...args}
					file={currentFile}
					startingPage={1}
					endingPage={1}
				/>
			)}
			<FloatingUploadButton
				uploadProps={uploadProps}
				tooltipText='Upload new PDF'
				buttonSize={40}
				position={{ right: '10px', bottom: '10px' }}
			/>
		</div>
	)
}

export const Interactive = InteractiveTemplate.bind({})
Interactive.args = {}

export const Default = Interactive.bind({})
Default.args = {
	showDeleteButton: true,
	index: 0,
	onRemove: (index) => console.log('Remove clicked for index:', index),
}
