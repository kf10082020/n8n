import { WorkflowPage, NDV } from '../pages';

const workflowPage = new WorkflowPage();
const ndv = new NDV();

describe('Schedule Trigger node', () => {
	beforeEach(() => {
		workflowPage.actions.visit();
	});

	it('should execute and return the execution timestamp', () => {
		cy.log('🧪 Adding Schedule Trigger to canvas');
		workflowPage.actions.addInitialNodeToCanvas('Schedule Trigger');

		cy.log('⚙️ Opening Schedule Trigger node');
		workflowPage.actions.openNode('Schedule Trigger');

		cy.log('🚀 Executing node');
		ndv.actions.execute();

		cy.log('🔎 Verifying output contains timestamp');
		ndv.getters.outputPanel().should('contain.text', 'timestamp');

		ndv.getters.backToCanvas().click();
	});
});
