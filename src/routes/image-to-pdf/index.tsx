import { createFileRoute } from '@tanstack/react-router'
import { ImageToPdf } from '@/pages/image-to-pdf/image-to-pdf'

export const Route = createFileRoute('/image-to-pdf/')({
  component: ImageToPdf,
})
