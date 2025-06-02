import { createFileRoute } from '@tanstack/react-router'
import { Arrangement } from '@/pages/arrangement'

export const Route = createFileRoute('/arrangement/')({
	component: Arrangement,
})
