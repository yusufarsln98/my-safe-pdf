import type { RefObject } from 'react'

export const isProduction = import.meta.env.MODE === 'production'

export function remToPx(rem: number | string): number {
	let remValue = ''
	if (typeof rem === 'string' && rem.includes('rem')) {
		remValue = rem.replace('rem', '')
	}

	return typeof rem === 'number' ? rem * 16 : parseFloat(remValue) * 16
}
export const getDivWidth = (ref: RefObject<HTMLDivElement | null>): number => {
	if (!ref.current) return 0
	return ref.current.getBoundingClientRect().width
}

export const getDivHeight = (ref: RefObject<HTMLDivElement>): number => {
	if (!ref.current) return 0
	return ref.current.getBoundingClientRect().height
}
