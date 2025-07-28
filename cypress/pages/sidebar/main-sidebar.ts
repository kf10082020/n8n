// cypress/composables/sidebar/index.ts
// Единый модуль взаимодействия с боковым меню (main + settings)

/**
 * ✅ Геттеры элементов бокового меню
 */

export const getSidebarMenuItem = (id: string) => cy.getByTestId('menu-item').get(`#${id}`);

export const getSidebarLogo = () => cy.getByTestId('n8n-logo');
export const getUserMenu = () => cy.getByTestId('user-menu');
export const getSettingsMenuItem = () => getSidebarMenuItem('settings');
export const getTemplatesMenuItem = () => getSidebarMenuItem('templates');
export const getWorkflowsMenuItem = () => getSidebarMenuItem('workflows');
export const getCredentialsMenuItem = () => getSidebarMenuItem('credentials');
export const getExecutionsMenuItem = () => getSidebarMenuItem('executions');
export const getAdminPanelMenuItem = () => getSidebarMenuItem('cloud-admin');
export const getSettingsBackButton = () => cy.getByTestId('settings-back');

/**
 * ✅ Геттеры элементов сайдбара настроек (settings sidebar)
 */

export const getSettingsSidebar = () => cy.getByTestId('settings-sidebar');
export const getSettingsSidebarTitle = () => cy.getByTestId('settings-sidebar-title');
export const getSettingsSidebarItem = (id: string) => cy.get(`#${id}`);

/**
 * ✅ Действия с сайдбаром
 */

export const openUserMenu = () => {
	getUserMenu().click();
};

export const goToSettings = () => {
	openUserMenu();
	cy.getByTestId('user-menu-item-settings').should('be.visible').click();
};

export const goToCredentials = () => {
	getCredentialsMenuItem().should('be.visible');
	cy.get('[data-old-overflow]').should('not.exist');
	getCredentialsMenuItem().click();
};

export const goToWorkflows = () => {
	getWorkflowsMenuItem().click();
};

export const closeSettingsSidebar = () => {
	getSettingsBackButton().click();
};

export const signout = () => {
	cy.visit('/workflows');
	openUserMenu();
	cy.getByTestId('user-menu-item-logout').click();
	cy.wrap(Cypress.session.clearAllSavedSessions());
};
