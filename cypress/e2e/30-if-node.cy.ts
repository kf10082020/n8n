import { IF_NODE_NAME } from '../constants';
import { WorkflowPage, NDV } from '../pages';

const workflowPage = new WorkflowPage();
const ndv = new NDV();

const FILTER_PARAM_NAME = 'conditions';

// 🔍 IF Node — Conditional Logic Testing Suite

describe('If Node (filter component)', () => {
	beforeEach(() => {
		cy.log('🔄 Visiting workflow page');
		workflowPage.actions.visit();
	});

	it('🧪 Should be able to create and delete multiple conditions', () => {
		cy.log('🎯 Adding IF node to canvas');
		workflowPage.actions.addInitialNodeToCanvas(IF_NODE_NAME, { keepNdvOpen: true });

		cy.log('✅ Verifying default state with one condition');
		ndv.getters.filterComponent(FILTER_PARAM_NAME).should('exist');
		ndv.getters.filterConditions(FILTER_PARAM_NAME).should('have.length', 1);
		ndv.getters
			.filterConditionOperator(FILTER_PARAM_NAME)
			.find('input')
			.should('have.value', 'is equal to');

		cy.log('➕ Adding filter conditions');
		ndv.actions.addFilterCondition(FILTER_PARAM_NAME);
		ndv.getters.filterConditionLeft(FILTER_PARAM_NAME, 0).find('input').type('first left');
		ndv.getters.filterConditionLeft(FILTER_PARAM_NAME, 1).find('input').type('second left');
		ndv.actions.addFilterCondition(FILTER_PARAM_NAME);
		ndv.getters.filterConditions(FILTER_PARAM_NAME).should('have.length', 3);

		cy.log('➖ Deleting first condition');
		ndv.actions.removeFilterCondition(FILTER_PARAM_NAME, 0);
		ndv.getters.filterConditions(FILTER_PARAM_NAME).should('have.length', 2);
		ndv.getters
			.filterConditionLeft(FILTER_PARAM_NAME, 0)
			.find('input')
			.should('have.value', 'second left');

		cy.log('➖ Deleting last condition');
		ndv.actions.removeFilterCondition(FILTER_PARAM_NAME, 1);
		ndv.getters.filterConditions(FILTER_PARAM_NAME).should('have.length', 1);
	});

	it('📊 Should correctly evaluate conditions in a workflow', () => {
		cy.log('📥 Loading fixture workflow with IF logic');
		cy.fixture('Test_workflow_filter.json').then((data) => {
			cy.get('body').paste(JSON.stringify(data));
		});

		cy.log('🔍 Executing the full workflow');
		workflowPage.actions.zoomToFit();
		workflowPage.actions.executeWorkflow();

		cy.log('🔄 Verifying THEN branch output');
		workflowPage.actions.openNode('Then');
		ndv.getters.outputPanel().contains('3 items').should('exist');
		ndv.actions.close();

		cy.log('🔄 Verifying ELSE branch output');
		workflowPage.actions.openNode('Else');
		ndv.getters.outputPanel().contains('1 item').should('exist');
	});
});
