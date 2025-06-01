import styled from 'styled-components'

export const StyledRangeGridItem = styled.div`
	position: relative;
	background: ${(props) => props.theme.colorBgContainer};
	border: 1px dashed ${(props) => props.theme.colorBorder};
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

export const ThumbnailWrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 1/1.4;
	background: ${(props) => props.theme.colorFillQuaternary};
	border-radius: ${(props) => props.theme.borderRadius}px;
	border: 1px solid ${(props) => props.theme.colorBorder};
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
