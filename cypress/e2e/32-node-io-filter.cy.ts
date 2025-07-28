import { WorkflowPage as WorkflowPageClass, NDV } from '../pages';

const workflowPage = new WorkflowPageClass();
const ndv = new NDV();

describe('🧪 Node IO Filter', () => {
	beforeEach(() => {
		cy.log('📥 Загрузка workflow и выполнение');
		workflowPage.actions.visit();
		cy.createFixtureWorkflow('Node_IO_filter.json', 'Node IO filter');
		workflowPage.actions.saveWorkflowOnButtonClick();
		workflowPage.actions.executeWorkflow();
	});

	it('🔎 фильтрует pinned output данные', () => {
		workflowPage.getters.canvasNodes().first().dblclick();
		ndv.actions.close();
		workflowPage.getters.canvasNodes().first().dblclick();

		ndv.getters.outputDataContainer().should('be.visible');
		ndv.getters.outputPanel().findChildByTestId('ndv-search').should('exist');

		cy.document().trigger('keyup', { key: '/' });
		const searchInput = ndv.getters.searchInput();

		searchInput.should('have.focus');
		ndv.getters.pagination().find('li').should('have.length', 3);
		ndv.getters.outputDataContainer().find('mark').should('not.exist');

		searchInput.type('ar');
		ndv.getters.pagination().find('li').should('have.length', 2);
		ndv.getters.outputDataContainer().find('mark').its('length').should('be.gt', 0);

		searchInput.type('i');
		ndv.getters.pagination().should('not.exist');
		ndv.getters.outputDataContainer().find('mark').its('length').should('be.gt', 0);
	});

	it('🎯 фильтрует input/output данные раздельно', () => {
		workflowPage.getters.canvasNodes().eq(1).dblclick();

		ndv.getters.inputDataContainer().should('be.visible');
		ndv.getters.outputDataContainer().should('be.visible');
		ndv.actions.switchInputMode('Table');

		// Проверка фокуса поиска на input по умолчанию
		cy.document().trigger('keyup', { key: '/' });
		const inputSearch = ndv.getters.inputPanel().findChildByTestId('ndv-search');
		inputSearch.should('have.focus');

		// Пагинация и счётчики до фильтрации
		const inputPagination = () => ndv.getters.inputPanel().findChildByTestId('ndv-data-pagination');
		const outputPagination = () => ndv.getters.outputPanel().findChildByTestId('ndv-data-pagination');
		const inputCount = () => ndv.getters.inputPanel().findChildByTestId('ndv-items-count');
		const outputCount = () => ndv.getters.outputPanel().findChildByTestId('ndv-items-count');

		inputPagination().find('li').should('have.length', 3);
		outputPagination().find('li').should('have.length', 3);
		inputCount().should('contain.text', '21 items');
		outputCount().should('contain.text', '21 items');

		inputSearch.type('ar');
		inputPagination().find('li').should('have.length', 2);
		inputCount().should('contain.text', '14 of 21 items');
		outputCount().should('contain.text', '21 items');

		inputSearch.type('i');
		inputPagination().should('not.exist');
		inputCount().should('contain.text', '8 of 21 items');
		outputCount().should('contain.text', '21 items');

		inputSearch.clear();
		inputPagination().find('li').should('have.length', 3);
		inputCount().should('contain.text', '21 items');

		// Переключение на output search через наведение мыши
		ndv.getters.outputDataContainer().trigger('mouseover');
		cy.document().trigger('keyup', { key: '/' });

		const outputSearch = ndv.getters.outputPanel().findChildByTestId('ndv-search');
		outputSearch.should('have.focus');

		outputSearch.type('ar');
		outputPagination().find('li').should('have.length', 2);
		outputCount().should('contain.text', '14 of 21 items');

		outputSearch.type('i');
		outputPagination().should('not.exist');
		outputCount().should('contain.text', '8 of 21 items');

		outputSearch.clear();
		outputPagination().find('li').should('have.length', 3);
		outputCount().should('contain.text', '21 items');
	});
});
