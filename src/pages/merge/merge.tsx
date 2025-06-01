import React from 'react'
import { Alert, Flex } from 'antd'
import { usePdfFiles } from './hooks/usePdfFiles'
import { EmptyState } from './components/EmptyState'
import { FloatingUploadButton } from './components/FloatingUploadButton'
import { GridSortablePdfList } from './components/GridSortablePdfList'
import styled from 'styled-components'

const Container = styled.div`
	position: relative;
	min-height: 100%;
	padding: 24px;
	overflow: hidden;
`

export const Merge: React.FC = () => {
	const { fileList, uploadProps, removeFile, setFileList } = usePdfFiles()

	return (
		<Container>
			{fileList.length === 0 ? (
				<EmptyState uploadProps={uploadProps} />
			) : (
				<Flex
					vertical
					gap={32}
				>
					<Alert
						message="Lütfen, 'PDF dosyaları seç' düğmesine tekrar tıklayarak birden fazla PDF dosyası seç. 'Ctrl' tuşunu basılı tutarak birden fazla dosyayı seçebilirsin."
						type='info'
						showIcon
					/>
					<GridSortablePdfList
						files={fileList}
						onFilesChange={setFileList}
						onRemoveFile={removeFile}
					/>
				</Flex>
			)}
			{fileList.length > 0 && (
				<FloatingUploadButton uploadProps={uploadProps} />
			)}
		</Container>
	)
}
