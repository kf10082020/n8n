/**
 * Страница настроек Community Nodes.
 * Предоставляет функции взаимодействия с UI: установка, обновление и удаление пакетов.
 */

/**
 * Переход на страницу Community Nodes в настройках.
 *
 * @example
 * visitCommunityNodesSettings();
 */
export const visitCommunityNodesSettings = (): void => {
	cy.visit('/settings/community-nodes');
};

/**
 * Возвращает все карточки установленных community-пакетов.
 *
 * @returns Chainable список карточек пакетов
 * @example
 * getCommunityCards().should('have.length.at.least', 1);
 */
export const getCommunityCards = (): Cypress.Chainable<JQuery<HTMLElement>> => {
	return cy.getByTestId('community-package-card');
};

/**
 * Запускает установку community-пакета по имени.
 *
 * @param nodeName - Имя пакета (npm)
 * @example
 * installFirstCommunityNode('n8n-nodes-weather');
 */
export const installFirstCommunityNode = (nodeName: string): void => {
	cy.getByTestId('action-box').find('button').click();
	cy.getByTestId('communityPackageInstall-modal').find('input').eq(0).type(nodeName);
	cy.getByTestId('user-agreement-checkbox').click();
	cy.getByTestId('install-community-package-button').click();
};

/**
 * Подтверждение действия обновления community-пакета.
 *
 * @example
 * confirmCommunityNodeUpdate();
 */
export const confirmCommunityNodeUpdate = (): void => {
	cy.getByTestId('communityPackageManageConfirm-modal').find('button').eq(1).click();
};

/**
 * Подтверждение действия удаления community-пакета.
 *
 * @example
 * confirmCommunityNodeUninstall();
 */
export const confirmCommunityNodeUninstall = (): void => {
	cy.getByTestId('communityPackageManageConfirm-modal').find('button').eq(1).click();
};
