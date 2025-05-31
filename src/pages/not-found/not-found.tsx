import { Link } from '@tanstack/react-router'
import { Button, Typography, Result } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const NotFoundContainer = styled.div`
	display: flex;
	align-items: center;
	min-height: 100vh;
	padding: 48px 16px;
`

const ContentWrapper = styled.div`
	width: 100%;
	text-align: center;
`

const StyledTitle = styled(Title)`
	font-weight: bold;
	letter-spacing: -0.05em;
	animation: bounce 1s infinite;
	color: ${(props) => props.theme.colorPrimary};

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
`

const StyledParagraph = styled(Paragraph)`
	color: ${(props) => props.theme.colorTextSecondary};
`

export const NotFound: React.FC = () => {
	return (
		<NotFoundContainer>
			<ContentWrapper>
				<Result
					status='404'
					title={<StyledTitle level={1}>404</StyledTitle>}
					subTitle={
						<StyledParagraph>
							Looks like you're lost. The page you are looking for does not
							exist.
						</StyledParagraph>
					}
					extra={
						<Button type='primary'>
							<Link to='/'>Return to Home</Link>
						</Button>
					}
				/>
			</ContentWrapper>
		</NotFoundContainer>
	)
}
