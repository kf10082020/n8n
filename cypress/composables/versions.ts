/**
 * ======================================
 * Version Updates Panel – Cypress Helper
 * ======================================
 * Команды для открытия, закрытия и проверки панели обновлений версий.
 */

/**
 * Getters
 */

/**
 * Кнопка открытия панели версий (иконка или надпись "What's new").
 */
export function getVersionUpdatesPanelOpenButton() {
	return cy.getByTestId('version-updates-panel-button').should('be.visible');
}

/**
 * Сама панель версий (drawer).
 */
export function getVersionUpdatesPanel() {
	return cy.getByTestId('version-updates-panel').should('exist');
}

/**
 * Кнопка закрытия панели версий (крестик).
 */
export function getVersionUpdatesPanelCloseButton() {
	return getVersionUpdatesPanel()
		.find('.el-drawer__close-btn')
		.first()
		.should('be.visible');
}

/**
 * Карточка обновления версии (может быть одна или несколько).
 */
export function getVersionCard() {
	return cy.getByTestId('version-card');
}

/**
 * Actions
 */

/**
 * Открывает панель обновлений версии.
 */
export function openVersionUpdatesPanel() {
	getVersionUpdatesPanelOpenButton().click();
	getVersionUpdatesPanel().should('be.visible');
}

/**
 * Закрывает панель обновлений версии.
 */
export function closeVersionUpdatesPanel() {
	getVersionUpdatesPanelCloseButton().click();
	getVersionUpdatesPanel().should('not.exist');
}
