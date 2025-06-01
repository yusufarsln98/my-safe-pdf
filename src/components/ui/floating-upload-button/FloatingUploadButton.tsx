import { PlusOutlined } from '@ant-design/icons'
import { Upload, Button, Badge, Tooltip } from 'antd'
import type { UploadProps } from 'antd'
import React from 'react'
import styled from 'styled-components'

const FloatingContainer = styled.div<{ position?: Position }>`
	position: fixed;
	right: ${(props) => props.position?.right ?? '24px'};
	bottom: ${(props) => props.position?.bottom ?? '24px'};
	left: ${(props) => props.position?.left};
	top: ${(props) => props.position?.top};
	z-index: 1000;
`

export interface Position {
	top?: string
	right?: string
	bottom?: string
	left?: string
}

export interface FloatingUploadButtonProps {
	uploadProps: UploadProps
	badgeCount?: number
	tooltipText?: string
	tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
	buttonSize?: number
	position?: Position
	buttonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
	icon?: React.ReactNode
}

export const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({
	uploadProps,
	badgeCount,
	tooltipText = 'Add more files',
	tooltipPlacement = 'left',
	buttonSize = 48,
	position,
	buttonType = 'primary',
	icon = <PlusOutlined />,
}) => {
	return (
		<FloatingContainer position={position}>
			<Badge
				count={badgeCount}
				offset={[0, 0]}
			>
				<Upload
					{...uploadProps}
					showUploadList={false}
				>
					<Tooltip
						title={tooltipText}
						placement={tooltipPlacement}
					>
						<Button
							type={buttonType}
							shape='circle'
							icon={icon}
							style={{ width: buttonSize, height: buttonSize }}
						/>
					</Tooltip>
				</Upload>
			</Badge>
		</FloatingContainer>
	)
}
