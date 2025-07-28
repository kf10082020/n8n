/**
 * Получает видимый модальный оверлей.
 * Используется для взаимодействия с открытыми диалоговыми окнами (ElDialog).
 *
 * @example
 * getVisibleModalOverlay().contains('Delete').click();
 */
export function getVisibleModalOverlay(): Cypress.Chainable<JQuery<HTMLElement>> {
	return cy.get('.el-overlay .el-overlay-dialog').filter(':visible');
}

/**
 * Проверяет, что модальное окно с заголовком или контентом отображается.
 *
 * @param text - Ожидаемый текст внутри модального окна
 * @
