/**
 * ================================================
 * Workflow Credential Setup Modal – Cypress Helpers
 * ================================================
 * Модальное окно для установки учётных данных в workflow.
 */

/**
 * Getters
 */

/**
 * Возвращает модальное окно настройки workflow credentials.
 */
export const getWorkflowCredentialsModal = () => {
	return cy.getByTestId('setup-workflow-credentials-modal').should('be.visible');
};

/**
 * Возвращает кнопку "Continue".
 */
export const getContinueButton = () => {
	return cy.getByTestId('continue-button').should('be.visible');
};

/**
 * Actions
 */

/**
 * Закрывает модальное окно, нажав "Continue".
 */
export const closeModalFromContinueButton = () => {
	getContinueButton().click();
};
