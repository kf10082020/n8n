/**
 * Типизация и декларация модуля `@cypress/grep/src/support`
 * Обеспечивает поддержку фильтрации тестов по тегам через переменную окружения `grep`
 * или аннотацию тестов (например, `[@smoke]`, `[@regression]`).
 */

/// <reference types="cypress" />

declare namespace Cypress {
	interface SuiteConfigOverrides {
		/**
		 * Фильтрация тестов по тегу (или нескольким тегам, через регулярное выражение).
		 * Устанавливается через переменную окружения: `--env grep=login`
		 * Или через интерфейс конфигурации.
		 *
		 * @example
		 * it('[@auth] should log in', () => {})
		 */
		grep?: string;

		/**
		 * Альтернативная переменная, используемая в некоторых версиях для тегирования групп.
		 * См. https://github.com/bahmutov/cypress-grep
		 */
		grepTags?: string;
	}
}

declare module '@cypress/grep/src/support' {
	/**
	 * Регистрирует поддержку `cypress-grep`, добавляя возможность фильтрации тестов по тегам.
	 *
	 * Вызывается в support файле Cypress:
	 * @example
	 * import '@cypress/grep/src/support';
	 */
	export function register(): void;
}
