# Stories

This folder contains Storybook stories for our React components.

## What is Storybook?

[Storybook](https://storybook.js.org/) is a frontend workshop for building UI components and pages in isolation. It helps you develop UI components in isolation from your app's business logic and context.

## Structure

Each component should have its own `.stories.tsx` file that follows this format:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './components/button'

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'Components/Button',
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
	args: {
		primary: true,
		label: 'Button',
	},
}
```

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
```

## Documentation

For more information, refer to the [Storybook documentation](https://storybook.js.org/docs/react/get-started/introduction).
