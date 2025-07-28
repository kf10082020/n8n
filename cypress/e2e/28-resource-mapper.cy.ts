import { WorkflowPage, NDV } from '../pages';

const workflowPage = new WorkflowPage();
const ndv = new NDV();

describe('Resource Mapper', () => {
	beforeEach(() => {
		cy.log('Visiting workflow page');
		workflowPage.actions.visit();
	});

	it('should not retrieve list options when required params throw errors', () => {
		cy.log('Adding node with resource mapping component');
		workflowPage.actions.addInitialNodeToCanvas('E2e Test', {
			action: 'Resource Mapping Component',
		});

		cy.log('Verifying presence of parameter inputs');
		ndv.getters.resourceMapperFieldsContainer()
			.should('be.visible')
			.findChildByTestId('parameter-input')
			.should('have.length', 3);

		cy.log('Setting invalid expression in required field');
		ndv.actions.setInvalidExpression({ fieldName: 'fieldId' });

		cy.log('Triggering column refresh');
		ndv.actions.refreshResourceMapperColumns();
		ndv.getters.resourceMapperFieldsContainer().should('not.exist');
	});

	it('should retrieve list options when optional params throw errors', () => {
		cy.log('Adding node with resource mapping component');
		workflowPage.actions.addInitialNodeToCanvas('E2e Test', {
			action: 'Resource Mapping Component',
		});

		cy.log('Verifying presence of parameter inputs');
		ndv.getters.resourceMapperFieldsContainer()
			.should('be.visible')
			.findChildByTestId('parameter-input')
			.should('have.length', 3);

		cy.log('Setting invalid expression in optional field');
		ndv.actions.setInvalidExpression({ fieldName: 'otherField' });

		cy.log('Triggering column refresh');
		ndv.actions.refreshResourceMapperColumns();
		ndv.getters.resourceMapperFieldsContainer()
			.should('be.visible')
			.findChildByTestId('parameter-input')
			.should('have.length', 3);
	});

	it('should correctly delete single field', () => {
		cy.log('Adding node with prefilled fields');
		workflowPage.actions.addInitialNodeToCanvas('E2e Test', {
			action: 'Resource Mapping Component',
		});

		ndv.getters.parameterInput('id').type('001');
		ndv.getters.parameterInput('name').type('John');
		ndv.getters.parameterInput('age').type('30');

		cy.log('Executing node');
		ndv.getters.nodeExecuteButton().click();

		cy.log('Validating output headers');
		ndv.getters.outputTableHeaderByText('id').should('exist');
		ndv.getters.outputTableHeaderByText('name').should('exist');
		ndv.getters.outputTableHeaderByText('age').should('exist');

		cy.log('Removing field "name"');
		ndv.getters.resourceMapperRemoveFieldButton('name').should('exist').click({ force: true });
		ndv.getters.nodeExecuteButton().click();

		cy.log('Validating remaining fields');
		ndv.getters.parameterInput('id').should('exist');
		ndv.getters.outputTableHeaderByText('id').should('exist');
		ndv.getters.parameterInput('age').should('exist');
		ndv.getters.outputTableHeaderByText('age').should('exist');

		cy.log('Ensuring removed field is gone');
		ndv.getters.parameterInput('name').should('not.exist');
		ndv.getters.outputTableHeaderByText('name').should('not.exist');
	});

	it('should correctly delete all fields', () => {
		cy.log('Adding node with multiple fields');
		workflowPage.actions.addInitialNodeToCanvas('E2e Test', {
			action: 'Resource Mapping Component',
		});

		ndv.getters.parameterInput('id').type('001');
		ndv.getters.parameterInput('name').type('John');
		ndv.getters.parameterInput('age').type('30');

		cy.log('Executing node');
		ndv.getters.nodeExecuteButton().click();

		cy.log('Checking headers before deletion');
		ndv.getters.outputTableHeaderByText('id').should('exist');
		ndv.getters.outputTableHeaderByText('name').should('exist');
		ndv.getters.outputTableHeaderByText('age').should('exist');

		cy.log('Opening column options and removing all fields');
		ndv.getters.resourceMapperColumnsOptionsButton().click();
		ndv.getters.resourceMapperRemoveAllFieldsOption().should('be.visible').click();

		cy.log('Re-executing node');
		ndv.getters.nodeExecuteButton().click();

		cy.log('Validating only required field remains');
		ndv.getters.parameterInput('id').should('exist');
		ndv.getters.outputTableHeaderByText('id').should('exist');
		ndv.getters.parameterInput('name').should('not.exist');
		ndv.getters.outputTableHeaderByText('name').should('not.exist');
		ndv.getters.parameterInput('age').should('not.exist');
		ndv.getters.outputTableHeaderByText('age').should('not.exist');
	});
});
