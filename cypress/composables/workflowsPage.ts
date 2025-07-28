/**
 * Workflows Page Composable
 */

//////////////////////////////
// URL / Navigation
//////////////////////////////

export const getWorkflowsPageUrl = (): string => '/home/workflows';

export const visitWorkflowsPage = (): void => {
	cy.visit(getWorkflowsPageUrl());
	cy.get('h1').contains(/workflows/i).should('exist');
};

//////////////////////////////
// UI Getters
//////////////////////////////

export const getCreateWorkflowButton = () => cy.getByTestId('add-resource-workflow');

export const getNewWorkflowCardButton = () => cy.getByTestId('new-workflow-card');

export const getWorkflowCardsList = () => cy.getByTestId('workflow-card');

export const getSearchInput = () => cy.get('input[placeholder="Search"]');

//////////////////////////////
// Actions
//////////////////////////////

export const createNewWorkflow = () => {
	getCreateWorkflowButton().click();
	getNewWorkflowCardButton().click();
};

export const searchWorkflowByName = (name: string) => {
	getSearchInput().clear().type(name);
};
