/**
 * ====================================
 * Universal Resource Creation Composable
 * ====================================
 * Унифицированный обработчик создания workflow / проекта / credential.
 */

/**
 * Возвращает универсальную кнопку "Add".
 */
export const universalAddButton = () => {
	return cy.getByTestId('universal-add').should('be.visible');
};

/**
 * Создаёт новый ресурс указанного типа.
 *
 * @param resourceType Тип ресурса: 'project', 'workflow', 'credential'
 * @param projectName Имя проекта, если создаётся workflow/credential
 */
export const createResource = (
	resourceType: 'project' | 'workflow' | 'credential',
	projectName: string,
) => {
	universalAddButton().click();

	// Выбор типа ресурса
	cy.getByTestId('navigation-submenu')
		.should('be.visible')
		.contains(new RegExp(`^${resourceType}$`, 'i')) // точное соответствие
		.click();

	// Привязка к проекту (если не создаётся сам проект)
	if (resourceType !== 'project') {
		cy.getByTestId('navigation-submenu-item')
			.should('be.visible')
			.contains(new RegExp(projectName, 'i'))
			.click();
	}
};
