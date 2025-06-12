import { Flex } from 'antd'
import type { UploadFile } from 'antd'
import React, { useMemo } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { ImageGridItem } from '../components/image-grid-item'
import { GlobalStyle } from './grid-sortable-pdf-list.styles'
import type { SortableItem } from './types'

interface ImageGridSortableListProps {
  files: UploadFile[]
  onFilesChange: (files: UploadFile[]) => void
  onRemoveFile: (index: number) => void
  onDragEnd?: (oldIndex: number, newIndex: number) => void
  gridGap?: number
  minColumnWidth?: number
  itemHeight?: number
  showDeleteButton?: boolean
}

export const ImageGridSortableList: React.FC<ImageGridSortableListProps> = ({
  files,
  onFilesChange,
  onRemoveFile,
  onDragEnd,
  gridGap = 16,
  minColumnWidth = 200,
  itemHeight = 280,
  showDeleteButton = true,
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
          <ImageGridItem
            key={file.uid}
            file={file}
            index={index}
            onRemove={onRemoveFile}
            showDeleteButton={showDeleteButton}
          />
        ))}
      </ReactSortable>
    </Flex>
  )
}
