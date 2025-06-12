import { DeleteOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React, { useMemo, useState } from 'react'
import {
  ThumbnailWrapper,
  FileInfo,
  FileName,
  FileSize,
  ActionButton,
  ActionButtons,
  StyledGridItem,
} from './grid-item.styles'
import type {
  SortableItem,
} from '../grid-sortable-list/types'
import { formatFileSize } from '../grid-sortable-list/utils'
import { ImageThumbnail } from '@/components/ui/image-thumbnail/image-thumbnail'

interface ImageGridItemProps {
  file: SortableItem
  index: number
  onRemove: (index: number) => void
  showDeleteButton?: boolean
}

export const ImageGridItem = React.memo(
  ({
    file,
    index,
    onRemove,
    showDeleteButton = true,
  }: ImageGridItemProps) => {
    const [imageInfo] = useState({
      fileName: file.name,
      fileSize: formatFileSize(file.size || 0),
    })

    const imageFile = useMemo(() => {
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

    if (!imageFile) return null

    const handleLoadSuccess = () => {
      // You could add additional logic here if needed
    }

    return (
      <StyledGridItem>
        <ActionButtons className='action-buttons ignoreDrag'>
          {showDeleteButton && (
            <Tooltip title='Delete Image'>
              <ActionButton
                variant='filled'
                color='red'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => onRemove(index)}
              />
            </Tooltip>
          )}
        </ActionButtons>
        <ThumbnailWrapper>
          <ImageThumbnail
            file={imageFile}
            onLoadSuccess={handleLoadSuccess}
            errorText="Failed to load image"
          />
        </ThumbnailWrapper>
        <FileInfo>
          <FileName>{file.name}</FileName>
          <FileSize>
            {imageInfo.fileSize}
          </FileSize>
        </FileInfo>
      </StyledGridItem>
    )
  }
)
