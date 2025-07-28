/**
 * Страница коллекции шаблонов (Template Collection Page).
 * Позволяет взаимодействовать с шаблонами внутри коллекции.
 */

export type Fixture = {
	id: number;
	fixture: string;
};

/**
 * Тестовые данные для различных коллекций шаблонов.
 * Можно дополнять новыми коллекциями и соответствующими фикстурами.
 */
export const testData = {
	ecommerceStarterPack: {
		id: 1,
		fixture: 'Ecommerce_starter_pack_template_collection.json',
	},
	// Добавьте дополнительные коллекции при необходимости
};

/**
 * Переходит на страницу коллекции шаблонов и перехватывает соответствующий сетевой запрос.
 *
 * @param withFixture - объект с `id` коллекции и названием фикстуры
 * @example
 * visitTemplateCollectionPage(testData.ecommerceStarterPack);
 */
export function visitTemplateCollectionPage(withFixture: Fixture): void {
	cy.intercept(
		'GET',
		`https://api.n8n.io/api/templates/collections/${withFixture.id}`,
		{ fixture: withFixture.fixture },
	).as('getTemplateCollection');

	cy.visit(`/collections/${withFixture.id}`);

	cy.wait('@getTemplateCollection');
}

/**
 * Наводит курсор на карточку шаблона по заголовку и нажимает кнопку "Use workflow".
 *
 * @param workflowTitle - заголовок шаблона, отображаемый на карточке
 * @example
 * clickUseWorkflowButtonByTitle('Sync Shopify orders to Google Sheets');
 */
export function clickUseWorkflowButtonByTitle(workflowTitle: string): void {
	cy.getByTestId('template-card')
		.contains('[data-test-id=template-card]', workflowTitle)
		.realHover({ position: 'center' })
		.findChildByTestId('use-workflow-button')
		.click({ force: true });
}
