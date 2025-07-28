/**
 * Страница настроек Public API.
 * Предоставляет функции для перехода и взаимодействия с элементами на странице.
 */

/**
 * Переход на страницу Public API в настройках.
 *
 * @example
 * visitPublicApiPage();
 */
export const visitPublicApiPage = (): void => {
	cy.visit('/settings/api');
};

/**
 * Получает элемент CTA (Call To Action) для апгрейда, связанный с Public API.
 *
 * @returns Chainable Cypress-элемент
 * @example
 * getPublicApiUpgradeCTA().should('be.visible');
 */
export const getPublicApiUpgradeCTA = (): Cypress.Chainable<JQuery<HTMLElement>> => {
	return cy.getByTestId('public-api-upgrade-cta');
};
