/**
 * Workflow Setup Credentials Composable
 */

//////////////////////////////
// Getters
//////////////////////////////

export const getSetupWorkflowCredentialsButton = () =>
	cy.get('button:contains("Set up template")');
