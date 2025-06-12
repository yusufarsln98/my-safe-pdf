import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const LoadingText = styled.div`
  color: ${(props) => props.theme.colorTextDescription};
  font-size: 12px;
`

const ThumbnailContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colorBgContainer};
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export type ImageSource = File | string | { url: string }

export interface ImageThumbnailProps {
  file: ImageSource
  onLoadSuccess?: () => void
  onLoadError?: (error: Error) => void
  loadingText?: string
  errorText?: string
}

const ImageThumbnailComponent: React.FC<ImageThumbnailProps> = ({
  file,
  onLoadSuccess,
  onLoadError,
  loadingText = 'Loading...',
  errorText = 'Failed to load image',
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFile = async () => {
      try {
        if (file instanceof File) {
          const url = URL.createObjectURL(file)
          setImageUrl(url)
        } else if (typeof file === 'string') {
          setImageUrl(file)
        } else if (file && typeof file === 'object' && 'url' in file) {
          setImageUrl(file.url)
        } else {
          throw new Error('Invalid file type')
        }
      } catch (err) {
        console.error('Error loading image file:', err)
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(errorText)
        onLoadError?.(error)
      }
    }

    loadFile()
    
    // Clean up object URLs to avoid memory leaks
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [file, errorText, onLoadError])

  return (
    <ThumbnailContainer>
      {error || !imageUrl ? (
        <LoadingText>{error || loadingText}</LoadingText>
      ) : (
        <img 
          src={imageUrl} 
          alt="Thumbnail" 
          onLoad={() => onLoadSuccess?.()}
          onError={(e) => {
            console.error('Image load error:', e)
            setError(errorText)
            onLoadError?.(new Error('Failed to load image'))
          }}
        />
      )}
    </ThumbnailContainer>
  )
}

export const ImageThumbnail = React.memo(ImageThumbnailComponent)
