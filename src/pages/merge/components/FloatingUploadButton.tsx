import React from 'react'
import { Upload, Button, Badge, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import styled from 'styled-components'

const FloatingContainer = styled.div`
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 1000;
`

interface FloatingUploadButtonProps {
	uploadProps: UploadProps
	badgeCount?: number
}

export const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({
	uploadProps,
	badgeCount,
}) => {
	return (
		<FloatingContainer>
			<Badge
				count={badgeCount}
				offset={[0, 0]}
			>
				<Upload
					{...uploadProps}
					showUploadList={false}
				>
					<Tooltip
						title='Daha fazla dosyalar ekle'
						placement='left'
					>
						<Button
							type='primary'
							shape='circle'
							icon={<PlusOutlined />}
							style={{ width: 48, height: 48 }}
						/>
					</Tooltip>
				</Upload>
			</Badge>
		</FloatingContainer>
	)
}
