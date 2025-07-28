/**
 * ================================================
 * Become Template Creator CTA – Cypress Composable
 * ================================================
 * Обработчики CTA блока "Become a template creator"
 */

//#region Getters

/**
 * Возвращает весь блок CTA.
 */
export const getBecomeTemplateCreatorCta = () => {
	return cy.getByTestId('become-template-creator-cta').should('be.visible');
};

/**
 * Возвращает кнопку закрытия блока CTA.
 */
export const getCloseBecomeTemplateCreatorCtaButton = () => {
	return cy.getByTestId('close-become-template-creator-cta').should('be.visible');
};

//#endregion

//#region Actions

/**
 * Перехватывает запрос CTA и подставляет кастомный ответ (true/false).
 * @param becomeCreator Если true — возвращает успешную активацию CTA.
 */
export const interceptCtaRequestWithResponse = (becomeCreator: boolean) => {
	return cy.intercept('GET', '/rest/cta/become-creator', {
		statusCode: 200,
		body: becomeCreator,
		delayMs: 150, // можно варьировать для симуляции задержки
	});
};

//#endregion
