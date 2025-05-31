import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			prettier, // Disable ESLint rules that conflict with Prettier
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: prettierPlugin, // Add Prettier as a plugin
			import: importPlugin, // Add import plugin to handle import rules
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'prettier/prettier': 'warn', // Enable Prettier formatting warnings
			'import/order': [
				'warn',
				{
					groups: [
						['builtin', 'external'],
						['internal', 'parent', 'sibling', 'index'],
					],
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			], // Enforce consistent import order
			'import/no-duplicates': 'warn', // Prevent duplicate imports
			'import/newline-after-import': ['warn', { count: 1 }], // Enforce newlines after import statements
		},
	}
)
