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
	pointer-events: none; /* Prevents scrollbar issues */

	/* Restore pointer events for the actual content */
	> * {
		pointer-events: auto;
	}
`

interface FloatingUploadButtonProps {
	uploadProps: UploadProps
}

export const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({
	uploadProps,
}) => {
	return (
		<FloatingContainer>
			<Badge count={1}>
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
							size='large'
							style={{ width: 56, height: 56 }}
						/>
					</Tooltip>
				</Upload>
			</Badge>
		</FloatingContainer>
	)
}
