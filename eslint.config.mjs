import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                    semi: true,
                    trailingComma: 'es5',
                    printWidth: 100,
                    tabWidth: 4,
                    bracketSpacing: true,
                    arrowParens: 'always',
                },
            ],
            'react/display-name': 'off',
            'react-hooks/set-state-in-effect': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: true,

                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    prettierConfig,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
