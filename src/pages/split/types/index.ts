export type SplitMode = 'custom' | 'fixed'

export interface PageRange {
	from: number
	to: number
}

export interface RangeFormValue {
	ranges: PageRange[]
}

export interface FixedSplitValue {
	pagesPerFile: number
}

export interface SplitSiderProps {
	totalPages: number
	onRangesChange: (values: RangeFormValue) => void
}
