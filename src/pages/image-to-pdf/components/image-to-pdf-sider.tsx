import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
        {t('buttons.back', 'Back')}
      </Button>
    </div>
  )
}
