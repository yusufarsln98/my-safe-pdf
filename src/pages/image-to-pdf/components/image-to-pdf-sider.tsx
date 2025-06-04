import { Button, Divider, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

interface ImageToPdfSiderProps {
  onBack: () => void
}

export const ImageToPdfSider: React.FC<ImageToPdfSiderProps> = ({ onBack }) => {
  const { t } = useTranslation()

  return (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={onBack}
        style={{ marginBottom: '20px' }}
      >
        Back
      </Button>

      <Title level={4}>Image to PDF</Title>
      <Divider />

      <Paragraph>
        Convert your image files (JPG, JPEG, PNG) to PDF format. You can upload multiple images and they will be converted to a single PDF document.
      </Paragraph>

      <Title level={5}>Instructions</Title>
      <Paragraph>
        <ol>
          <li>Upload one or more image files</li>
          <li>Arrange the images in the desired order</li>
          <li>Click "Convert to PDF" button</li>
          <li>Download the resulting PDF file</li>
        </ol>
      </Paragraph>

      <Title level={5}>Supported File Types</Title>
      <Paragraph>
        <ul>
          <li>JPEG/JPG</li>
          <li>PNG</li>
        </ul>
      </Paragraph>
    </div>
  )
}
