/**
 * Credentials Composables
 */

//////////////////////////////
// URL & Navigation
//////////////////////////////

export const getCredentialsPageUrl = () => '/home/credentials';

export const verifyCredentialsListPageIsLoaded = () => {
	cy.get('[data-test-id="resources-list-wrapper"], [data-test-id="empty-resources-list"]').should(
		'be.visible',
	);
};

export const loadCredentialsPage = (url: string) => {
	cy.visit(url);
	verifyCredentialsListPageIsLoaded();
};

//////////////////////////////
// Page Getters
//////////////////////////////

export const getEmptyListCreateCredentialButton = () =>
	cy.getByTestId('empty-resources-list').find('button');

export const getCredentialCards = () => cy.getByTestId('resources-list-item');

//////////////////////////////
// Modal Getters
//////////////////////////////

export const getNewCredentialModal = () =>
	cy.getByTestId('selectCredential-modal', { timeout: 5000 });

export const getEditCredentialModal = () =>
	cy.getByTestId('editCredential-modal', { timeout: 5000 });

export const getNewCredentialTypeSelect = () => cy.getByTestId('new-credential-type-select');

export const getNewCredentialTypeOption = (type: string) =>
	cy.getByTestId('new-credential-type-select-option').contains(type);

export const getNewCredentialTypeButton = () => cy.getByTestId('new-credential-type-button');

export const getCredentialConnectionParameterInputs = () =>
	cy.getByTestId('credential-connection-parameter');

export const getConnectionParameter = (field: string) =>
	getCredentialConnectionParameterInputs().find(`:contains('${field}') .n8n-input input`);

export const getCredentialSaveButton = () =>
	cy.getByTestId('credential-save-button', { timeout: 5000 });

//////////////////////////////
// Modal Actions
//////////////////////////////

export const setCredentialName = (name: string) => {
	cy.getByTestId('credential-name').find('span[data-test-id=inline-edit-preview]').click();
	cy.getByTestId('credential-name').type(name);
};

export const saveCredential = () => {
	getCredentialSaveButton()
		.click({ force: true })
		.within(() => {
			cy.get('button').should('not.exist');
		});
	getCredentialSaveButton().should('have.text', 'Saved');
};

export const saveCredentialWithWait = () => {
	cy.intercept('POST', '/rest/credentials').as('saveCredential');
	saveCredential();
	cy.wait('@saveCredential');
	getCredentialSaveButton().should('contain.text', 'Saved');
};

export const closeNewCredentialModal = () => {
	getNewCredentialModal().find('.el-dialog__close').first().click();
};

export const createNewCredential = (
	type: string,
	name: string,
	parameter: string,
	value: string,
	closeModal = true,
) => {
	getEmptyListCreateCredentialButton().click();

	getNewCredentialModal().should('be.visible');
	getNewCredentialTypeSelect().should('be.visible');
	getNewCredentialTypeOption(type).click();

	getNewCredentialTypeButton().click();
	getConnectionParameter(parameter).type(value);

	setCredentialName(name);
	saveCredential();

	if (closeModal) {
		getEditCredentialModal().find('.el-dialog__close').first().click();
	}
};
