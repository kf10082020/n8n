import {
	deleteNode,
	getCanvasNodes,
	navigateToNewWorkflowPage,
	pasteWorkflow,
} from '../composables/workflow';
import SwitchNodeFixture from '../fixtures/Switch_node_with_null_connection.json';

describe('🧩 ADO-2929: Load legacy Switch node workflows with null connections', () => {
	it('🔁 загружает workflow с Switch-узлом, содержащим null в connection index', () => {
		cy.log('🚀 Навигация к новому workflow');
		navigateToNewWorkflowPage();

		cy.log('📋 Вставка workflow с Switch-нодом');
		pasteWorkflow(SwitchNodeFixture);

		cy.log('🔍 Проверка количества нод на canvas');
		getCanvasNodes().should('have.length', 3);

		cy.log('❌ Удаление Switch-ноды');
		deleteNode('Switch');

		cy.log('✅ Проверка, что осталось 2 ноды');
		getCanvasNodes().should('have.length', 2);
	});
});
