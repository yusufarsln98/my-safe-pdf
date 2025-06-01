import { Button, List } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    .sortable-ghost {
        background-color: ${(props) => props.theme.colorBgTextHover} !important;
        border: 2px dashed ${(props) => props.theme.colorBorder} !important;
        border-radius: ${(props) => props.theme.borderRadius}px;

        * {
            opacity: 0;
        }
    }

    .sortable-drag {
        background-color: ${(props) => props.theme.colorBgContainer} !important;
        border-radius: ${(props) => props.theme.borderRadius}px;
        box-shadow: ${(props) => props.theme.boxShadowSecondary} !important;
        cursor: grabbing !important;

        .drag-handle {
            color: ${(props) => props.theme.colorPrimary} !important;
        }
    }
`

export const ListContainer = styled.div`
	border: 1px solid ${(props) => props.theme.colorBorder};
	border-radius: ${(props) => props.theme.borderRadius}px;
	overflow: hidden;
	background: ${(props) => props.theme.colorBgContainer};
	box-shadow: ${(props) => props.theme.boxShadow};
`

export const StyledListItem = styled(List.Item)`
	cursor: move;
	padding: 16px 24px;
	margin: 0 !important;
	border-bottom: 1px solid ${(props) => props.theme.colorBorder};
	display: flex;
	align-items: center;
	gap: 16px;
	transition: all 0.2s ease;
	background: ${(props) => props.theme.colorBgContainer};

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: ${(props) => props.theme.colorBgTextHover};
	}

	.ant-list-item-meta {
		flex: 1;
		margin-bottom: 0;
		padding: 4px 0;
		margin-left: 16px;
	}

	.ant-list-item-meta-title {
		margin-bottom: 4px;
		font-size: 15px;
		line-height: 1.5;
		color: ${(props) => props.theme.colorText};
	}

	.ant-list-item-meta-description {
		font-size: 13px;
		color: ${(props) => props.theme.colorTextDescription};
	}

	.ant-list-item-action {
		margin-left: 16px;
		padding: 0 8px;
	}
`

export const DragHandle = styled.div`
	padding: 8px;
	margin-right: 8px;
	cursor: grab;
	color: ${(props) => props.theme.colorTextQuaternary};
	user-select: none;
	display: flex;
	align-items: center;
	height: 100%;
	transition: color 0.2s ease;

	${StyledListItem}:hover & {
		color: ${(props) => props.theme.colorTextTertiary};
	}

	&:active {
		cursor: grabbing;
	}

	&::before {
		content: '⋮⋮';
		font-size: 20px;
		line-height: 1;
	}
`

export const DeleteButton = styled(Button)`
	opacity: 0.6;
	transition: opacity 0.2s ease;

	${StyledListItem}:hover & {
		opacity: 1;
	}
`

export const ContentContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	flex: 1;
`
