import { theme } from 'antd'
import React, { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

const { useToken } = theme

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeConfigProvider: React.FC<ThemeProviderProps> = ({
	children,
}) => {
	const { token } = useToken()

	return <StyledThemeProvider theme={token}>{children}</StyledThemeProvider>
}
