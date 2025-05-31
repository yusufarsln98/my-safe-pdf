import { useState, useRef, useEffect } from 'react'

const SIDEBAR_WIDTH_STORAGE_KEY = 'app_sidebar_width'

interface UseSidebarStateProps {
	defaultWidth?: number
	minWidth?: number
	maxWidth?: number
}

export const useSidebarState = ({
	defaultWidth = 200,
	minWidth = 120,
	maxWidth = 600,
}: UseSidebarStateProps = {}) => {
	const getInitialWidth = (): number => {
		try {
			const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY)
			return savedWidth ? parseInt(savedWidth, 10) : defaultWidth
		} catch (error) {
			console.error('Error reading sidebar width from localStorage:', error)
			return defaultWidth
		}
	}

	const [collapsed, setCollapsed] = useState(false)
	const [siderWidth, setSiderWidth] = useState(getInitialWidth)
	const [isDragging, setIsDragging] = useState(false)
	const startXRef = useRef<number>(0)
	const startWidthRef = useRef<number>(0)

	const MIN_WIDTH_THRESHOLD = minWidth

	const saveSiderWidth = (width: number) => {
		try {
			localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, width.toString())
		} catch (error) {
			console.error('Error saving sidebar width to localStorage:', error)
		}
	}

	const setSiderWidthWithStorage = (width: number) => {
		setSiderWidth(width)
		saveSiderWidth(width)
	}

	const startResizing = (e: React.MouseEvent) => {
		e.preventDefault()
		setIsDragging(true)
		startXRef.current = e.clientX
		startWidthRef.current = siderWidth
	}

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return

			const newWidth = startWidthRef.current + (e.clientX - startXRef.current)

			if (newWidth < MIN_WIDTH_THRESHOLD) {
				setCollapsed(true)
				setSiderWidth(defaultWidth)
				setIsDragging(false)
				return
			}

			if (newWidth > MIN_WIDTH_THRESHOLD && newWidth < maxWidth) {
				setSiderWidthWithStorage(newWidth)
			}
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDragging, collapsed, defaultWidth, maxWidth, MIN_WIDTH_THRESHOLD])

	useEffect(() => {
		if (!collapsed && siderWidth === 0) {
			const savedWidth = getInitialWidth()
			setSiderWidth(savedWidth)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collapsed, siderWidth])

	return {
		collapsed,
		setCollapsed,
		siderWidth,
		setSiderWidth: setSiderWidthWithStorage,
		isDragging,
		setIsDragging,
		startResizing,
	}
}
