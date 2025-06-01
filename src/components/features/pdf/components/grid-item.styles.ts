import styled, { createGlobalStyle } from 'styled-components'
import { Button } from 'antd'

interface GlobalStyleProps {
	gridGap: number
	minColumnWidth: number
	itemHeight: number
}

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
    .grid-container {
        display: grid;
        grid-gap: ${(props) => props.gridGap}px;
        grid-template-columns: repeat(auto-fill, minmax(${(props) =>
					props.minColumnWidth}px, 1fr));
        grid-auto-rows: minmax(${(props) => props.itemHeight}px, auto);
        background: ${(props) => props.theme.colorBgLayout};
        border-radius: ${(props) => props.theme.borderRadius}px;
    }

    .dropArea {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: ${(props) => props.theme.colorBgTextHover};
            border: 2px dashed ${(props) => props.theme.colorBorder};
            border-radius: ${(props) => props.theme.borderRadius}px;
        }
    }
`

export const ActionButtons = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s ease;
	z-index: 2;
`

export const ThumbnailWrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 1/1.4;
	background: ${(props) => props.theme.colorFillQuaternary};
	border-radius: ${(props) => props.theme.borderRadius}px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	.react-pdf__Document {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

export const FileInfo = styled.div`
	text-align: center;
`

export const FileName = styled.div`
	color: ${(props) => props.theme.colorText};
	font-size: 14px;
	font-weight: 500;
	margin-bottom: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

export const FileSize = styled.div`
	color: ${(props) => props.theme.colorTextDescription};
	font-size: 12px;
`

export const ActionButton = styled(Button)`
	background: ${(props) => props.theme.colorBgContainer};
	box-shadow: ${(props) => props.theme.boxShadow};

	&:hover {
		background: ${(props) => props.theme.colorBgContainer} !important;
	}
`

export const StyledGridItem = styled.div`
	position: relative;
	background: ${(props) => props.theme.colorBgContainer};
	border: 1px solid ${(props) => props.theme.colorBorder};
	border-radius: ${(props) => props.theme.borderRadius}px;
	padding: 16px;
	cursor: grab;
	transition: all 0.2s ease;
	display: flex;
	flex-direction: column;
	gap: 12px;

	&:hover {
		border-color: ${(props) => props.theme.colorPrimary};
		box-shadow: ${(props) => props.theme.boxShadowTertiary};

		.action-buttons {
			opacity: 1;
		}
	}

	&:active {
		cursor: grabbing;
	}
`
