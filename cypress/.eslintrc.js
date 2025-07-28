const sharedOptions = require('@n8n/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	// 📦 Базовые правила + Cypress best practices
	extends: ['@n8n/eslint-config/base', 'plugin:cypress/recommended'],

	// 🔄 Подключаем опции из монорепо
	...sharedOptions(__dirname),

	plugins: ['cypress'],

	env: {
		// ✅ Глобальные переменные Cypress (cy, Cypress, etc.)
		'cypress/globals': true,
	},

	rules: {
		// 🚧 Временно отключённые правила (до рефакторинга)
		// 🔕 Безопасность типов отключена для скорости e2e-разработки
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/promise-function-async': 'off',

		// ❌ Отключено для поддержки кастомной обработки JSON
		'n8n-local-rules/no-uncaught-json-parse': 'off',

		// 🧪 Cypress-specific best practices
		'cypress/no-assigning-return-values': 'warn',
		'cypress/no-unnecessary-waiting': 'warn',
		'cypress/unsafe-to-chain-command': 'warn',

		// 📦 Разрешаем devDependencies в e2e-тестах
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/cypress/**'],
				optionalDependencies: false,
			},
		],
	},
};
