import styled from 'styled-components'

export const ActiveDot = styled.div`
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colorPrimary};
	margin-left: auto;
`
