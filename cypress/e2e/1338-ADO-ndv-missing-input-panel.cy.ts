import { NDV, WorkflowPage as WorkflowPageClass } from '../pages';
import { successToast } from '../pages/notifications';

const workflowPage = new WorkflowPageClass();
const ndv = new NDV();

describe('ADO-1338: NDV missing input/output panel regression', () => {
	beforeEach(() => {
		workflowPage.actions.visit();
	});

	it('should show both input and output panels when node has no runtime data', () => {
		cy.createFixtureWorkflow('Test_ado_1338.json');

		workflowPage.getters.zoomToFitButton().click();
		workflowPage.getters.executeWorkflowButton().click();

		successToast().should('be.visible');

		workflowPage.actions.openNode('Discourse1');

		ndv.getters.inputPanel().should('be.visible');
		ndv.getters.outputPanel().should('be.visible');
	});
});
