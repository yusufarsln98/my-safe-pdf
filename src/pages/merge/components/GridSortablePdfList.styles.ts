import { Button } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    .grid-container {
        display: grid;
        grid-gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-auto-rows: minmax(280px, auto);
        padding: 16px;
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

export const GridItem = styled.div`
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

		.delete-button {
			opacity: 1;
		}
	}

	&:active {
		cursor: grabbing;
	}
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

export const DeleteButton = styled(Button)`
	position: absolute;
	top: 8px;
	right: 8px;
	opacity: 0;
	transition: opacity 0.2s ease;
	background: ${(props) => props.theme.colorBgContainer};
	box-shadow: ${(props) => props.theme.boxShadow};
	z-index: 2;

	&:hover {
		background: ${(props) => props.theme.colorBgContainer} !important;
	}
`
