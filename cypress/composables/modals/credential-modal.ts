import { clearNotifications } from '../../pages/notifications';

/**
 * ==============================
 * Credential Modal – Cypress API
 * ==============================
 * Работа с модальным окном редактирования учётных данных
 */

/**
 * Getters
 */

export function getCredentialConnectionParameterInputs() {
	return cy.getByTestId('credential-connection-parameter');
}

export function getCredentialConnectionParameterInputByName(name: string) {
	return cy.getByTestId(`parameter-input-${name}`);
}

export function getEditCredentialModal() {
	return cy.getByTestId('editCredential-modal', { timeout: 5000 });
}

export function getCredentialSaveButton() {
	return cy.getByTestId('credential-save-button', { timeout: 5000 });
}

export function getCredentialDeleteButton() {
	return cy.getByTestId('credential-delete-button');
}

export function getCredentialModalCloseButton() {
	return getEditCredentialModal().find('.el-dialog__close').first();
}

/**
 * Actions
 */

/**
 * Устанавливает значение параметра по имени.
 */
export function setCredentialConnectionParameterInputByName(name: string, value: string) {
	getCredentialConnectionParameterInputByName(name)
		.should('be.visible')
		.clear()
		.type(value);
}

/**
 * Сохраняет учётные данные.
 */
export function saveCredential() {
	getCredentialSaveButton()
		.should('be.visible')
		.click({ force: true });

	getCredentialSaveButton()
		.should('contain.text', 'Saved');
}

/**
 * Закрывает модальное окно.
 */
export function closeCredentialModal() {
	getCredentialModalCloseButton()
		.should('be.visible')
		.click();
}

/**
 * Устанавливает несколько значений параметров и сохраняет (если нужно).
 */
export function setCredentialValues(values: Record<string, string>, save = true) {
	Object.entries(values).forEach(([key, value]) => {
		setCredentialConnectionParameterInputByName(key, value);
	});

	if (save) {
		saveCredential();
		closeCredentialModal();
		clearNotifications();
	}
}
