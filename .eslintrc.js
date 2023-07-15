module.exports = {
	env: {
		node: true,
		browser: true,
		es2021: true
	},
	parserOptions: {
		sourceType: 'module'
	},
	plugins: ['import'],
	extends: ['plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': 'warn'
	},
	overrides: [
		{
			files: '*.ts',
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint'],
			parserOptions: {
				project: 'tsconfig.json'
			},
			extends: [
				'airbnb-typescript/base',
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:prettier/recommended',
				'plugin:import/recommended'
			],
			rules: {
				'no-plusplus': 'off',
				'no-underscore-dangle': 'off',
				'@typescript-eslint/no-namespace': 'off',
				'@typescript-eslint/no-misused-promises': 'off',
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'prettier/prettier': 'warn'
			}
		}
	]
}
