# lib

This folder contains general utility functions and library code used across the application.

## Purpose

The `lib` directory houses shared functionality that isn't tied to specific components or features. This includes:

- Helper functions
- Utility classes
- Service abstractions
- API clients
- Type definitions
- Constants

## Usage

Import utilities from this folder as needed throughout your application:

```typescript
import { formatDate } from '../lib/dateUtils'
import { apiClient } from '../lib/api'
import { isValidEmail } from '../lib/validators'
```

## Guidelines

When adding to this directory:

- Keep files focused on a single responsibility
- Write thorough documentation and tests
- Avoid dependencies on specific UI components
- Consider naming files based on their purpose (e.g., `dateUtils.ts`, `formatters.ts`)
- Export all public functions/classes from an index file when appropriate

## Structure

```
lib/
├── api/            # API related functionality
├── hooks/          # Custom React hooks
├── types/          # Shared TypeScript types
├── utils/          # General utility functions
├── constants.ts    # Shared constants
└── index.ts        # Exports all utilities
```
