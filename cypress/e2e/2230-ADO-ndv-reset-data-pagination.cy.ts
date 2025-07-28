import { NDV, WorkflowPage } from '../pages';
import { clearNotifications } from '../pages/notifications';

const workflowPage = new WorkflowPage();
const ndv = new NDV();

describe('ADO-2230 NDV Pagination Reset', () => {
	it('should reset pagination if data size changes to less than current page', () => {
		cy.log('📦 Visit workflow editor');
		workflowPage.actions.visit();

		cy.log('📂 Load fixture workflow with DebugHelper node');
		cy.createFixtureWorkflow('NDV-debug-generate-data.json', 'Debug workflow');
		workflowPage.actions.openNode('DebugHelper');

		cy.log('🚀 Execute node outputting 10 pages and check first page');
		ndv.actions.execute();
		clearNotifications();
		ndv.getters.outputTbodyCell(1, 1).invoke('text').should('eq', 'Terry.Dach@hotmail.com');

		cy.log('📃 Open 4th page and check output');
		ndv.getters.pagination().should('be.visible');
		ndv.getters.pagination().find('li.number').should('have.length', 5);
		ndv.getters.pagination().find('li.number').eq(3).click();
		ndv.getters.outputTbodyCell(1, 1).invoke('text').should('eq', 'Shane.Cormier68@yahoo.com');

		cy.log('🔄 Change data amount to 20 and re-execute');
		ndv.getters.parameterInput('randomDataCount').find('input').clear().type('20');
		ndv.actions.execute();
		clearNotifications();

		cy.log('✅ Assert pagination resets to page 1 with new data');
		ndv.getters.pagination().find('li.number').should('have.length', 2);
		ndv.getters.outputTbodyCell(1, 1).invoke('text').should('eq', 'Sylvia.Weber@hotmail.com');
	});
});
