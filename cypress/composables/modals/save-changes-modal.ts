/**
 * =====================================
 * Save Changes Modal – Cypress Helpers
 * =====================================
 * Модальное окно "Save changes before leaving?"
 */

/**
 * Возвращает модальное окно подтверждения сохранения изменений.
 */
export function getSaveChangesModal() {
	return cy.get('.el-overlay').contains('Save changes before leaving?');
}

/**
 * Кнопка "Cancel" рядом с "Save Changes".
 */
export function getCancelSaveChangesButton() {
	return cy.get('.btn--cancel').should('be.visible');
}

/**
 * Кнопка закрытия модального окна (крестик в правом верхнем углу).
 */
export function getCloseSaveChangesButton() {
	return cy.get('.el-message-box__headerbtn').should('be.visible');
}
