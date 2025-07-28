// Functional composables for Settings Sidebar

export const getSettingsSidebarMenuItem = (id: string) =>
	cy.getByTestId('menu-item').get('#' + id);

export const getUsersMenuItem = () => getSettingsSidebarMenuItem('settings-users');

export const getSettingsBackButton = () => cy.getByTestId('settings-back');

export const goToUsers = () => {
	getUsersMenuItem().should('be.visible');
	cy.get('[data-old-overflow]').should('not.exist'); // Wait for animation completion
	getUsersMenuItem().click();
};

export const goBackFromSettings = () => {
	getSettingsBackButton().click();
};
