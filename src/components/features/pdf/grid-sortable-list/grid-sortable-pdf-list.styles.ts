import { createGlobalStyle } from 'styled-components'

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
