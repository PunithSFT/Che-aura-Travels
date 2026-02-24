// eslint.config.mjs
import nextPlugin from 'eslint-config-next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import importPlugin from 'eslint-plugin-import'; // New import

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { browser: true, node: true },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      tailwindcss: tailwindPlugin,
      import: importPlugin, // Add plugin
    },
    rules: {
      ...nextPlugin.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }], // Example rule
    },
  },
];