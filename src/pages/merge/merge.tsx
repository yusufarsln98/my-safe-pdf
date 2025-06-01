import React, { useState } from 'react'
import { Alert, Layout, Button, Typography, message } from 'antd'
import { usePdfFiles } from './hooks/usePdfFiles'
import { EmptyState } from './components/EmptyState'
import { FloatingUploadButton } from './components/FloatingUploadButton'
import { GridSortablePdfList } from './components/GridSortablePdfList'
import { mergePDFs, downloadPDF } from './utils/pdfUtils'
import { MergeSuccess } from './components/MergeSuccess'
import styled from 'styled-components'

const { Content, Sider } = Layout

const Container = styled(Layout)`
	min-height: calc(100vh - 64px);
`

const StyledContent = styled(Content)`
	display: flex;
	flex-direction: column;
	padding: 24px;
	flex: 1;
`

const StyledSider = styled(Sider)`
	min-height: calc(100vh - 64px);
	background-color: ${(props) => props.theme.colorBgContainer};
	border-left: ${(props) => props.theme.colorBorder} 1px solid;
	display: flex;
	flex-direction: column;
`

const SidebarContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
	flex: 1;
`

const SidebarTitleContainer = styled.div`
	border-bottom: ${(props) => props.theme.colorBorder} 1px solid;
	padding: 16px;
`

export const Merge: React.FC = () => {
	const { fileList, uploadProps, removeFile, setFileList } = usePdfFiles()
	const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null)

	const handleMerge = async () => {
		try {
			message.loading({
				content: 'PDF dosyaları birleştiriliyor...',
				key: 'merging',
			})
			const pdfBytes = await mergePDFs(fileList)
			setMergedPdfBytes(pdfBytes)
			message.success({
				content: 'PDF dosyaları başarıyla birleştirildi!',
				key: 'merging',
			})
		} catch (error) {
			console.error('Error merging PDFs:', error)
			message.error({
				content: 'PDF dosyaları birleştirilirken bir hata oluştu.',
				key: 'merging',
			})
		}
	}

	const handleDownload = () => {
		if (mergedPdfBytes) {
			downloadPDF(mergedPdfBytes, 'birlestirilmis.pdf')
		}
	}

	const handleBack = () => {
		setMergedPdfBytes(null)
	}

	if (mergedPdfBytes) {
		return (
			<MergeSuccess
				onBack={handleBack}
				onDownload={handleDownload}
				mergedPdfBytes={mergedPdfBytes}
			/>
		)
	}

	return (
		<Container>
			{fileList.length === 0 ? (
				<StyledContent>
					<EmptyState uploadProps={uploadProps} />
				</StyledContent>
			) : (
				<>
					<StyledContent>
						<GridSortablePdfList
							files={fileList}
							onFilesChange={setFileList}
							onRemoveFile={removeFile}
							showMergeButton={false}
						/>
						<Button
							type='primary'
							size='large'
							disabled={fileList.length < 2}
							style={{ width: '100%', marginTop: '24px' }}
							onClick={handleMerge}
						>
							PDF'leri Birleştir
						</Button>
					</StyledContent>
					<StyledSider width={300}>
						<SidebarTitleContainer>
							<Typography.Title
								level={5}
								style={{ margin: 0, padding: 0 }}
							>
								PDF'leri Birleştir
							</Typography.Title>
						</SidebarTitleContainer>
						<SidebarContent>
							<Alert
								message="Lütfen, 'PDF dosyaları seç' düğmesine tekrar tıklayarak birden fazla PDF dosyası seç. 'Ctrl' tuşunu basılı tutarak birden fazla dosyayı seçebilirsin."
								type='info'
							/>
						</SidebarContent>
					</StyledSider>
				</>
			)}
			{fileList.length > 0 && (
				<FloatingUploadButton
					uploadProps={uploadProps}
					badgeCount={fileList.length}
				/>
			)}
		</Container>
	)
}
