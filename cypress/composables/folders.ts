import { errorToast, successToast } from '../pages/notifications';

/**
 * Folders Composable — Cypress helpers for folder, workflow, and project UI interactions
 */

/// <reference types="cypress" />

/* =========================================================================
 * Navigation
 * ========================================================================= */
export const getPersonalProjectMenuItem = () => cy.getByTestId('project-personal-menu-item');
export const getProjectMenuItem = (name: string) => {
	if (name.toLowerCase() === 'personal') return getPersonalProjectMenuItem();
	return cy.getByTestId('project-menu-item').contains(name);
};
export const getOverviewMenuItem = () => cy.getByTestId('menu-item').contains('Overview');

/* =========================================================================
 * Resource Cards
 * ========================================================================= */
export const getFolderCards = () => cy.getByTestId('folder-card');
export const getFolderCard = (name: string) =>
	cy.getByTestId('folder-card-name').contains(name).closest('[data-test-id="folder-card"]');
export const getWorkflowCards = () => cy.getByTestId('resources-list-item-workflow');
export const getWorkflowCard = (name: string) =>
	cy.getByTestId('workflow-card-name').contains(name).closest('[data-test-id="resources-list-item-workflow"]');

export const getWorkflowCardActions = (name: string) =>
	getWorkflowCard(name).find('[data-test-id="workflow-card-actions"]');

export const getFolderCardActions = (name: string) =>
	getFolderCard(name).find('[data-test-id="folder-card-actions"]');

/* =========================================================================
 * Breadcrumbs
 * ========================================================================= */
export const getListBreadcrumbs = () => cy.getByTestId('main-breadcrumbs');
export const getListBreadcrumbItem = (name: string) =>
	getListBreadcrumbs().findChildByTestId('breadcrumbs-item').contains(name);
export const getCurrentBreadcrumb = () =>
	getListBreadcrumbs().findChildByTestId('breadcrumbs-item-current').find('input');
export const getCurrentBreadcrumbText = () => getCurrentBreadcrumb().invoke('val');

/* =========================================================================
 * Modals & Dropdowns
 * ========================================================================= */
export const getDuplicateWorkflowModal = () => cy.getByTestId('duplicate-modal');
export const getWorkflowMenu = () => cy.getByTestId('workflow-menu');
export const getAddFolderButton = () => cy.getByTestId('add-folder-button');
export const getAddResourceDropdown = () => cy.getByTestId('add-resource');
export const getMoveToFolderDropdown = () => cy.getByTestId('move-to-folder-dropdown');
export const getMoveToFolderOption = (name: string) => cy.getByTestId('move-to-folder-option').contains(name);
export const getMoveToFolderInput = () => getMoveToFolderDropdown().find('input');
export const getMoveFolderConfirmButton = () => cy.getByTestId('confirm-move-folder-button');
export const getMoveFolderModal = () => cy.getByTestId('moveFolder-modal');
export const getProjectSharingInput = () => cy.getByTestId('project-sharing-select');
export const getProjectSharingOption = (name: string) => cy.getByTestId('project-sharing-info').contains(name);

/* =========================================================================
 * Actions
 * ========================================================================= */
export function goToPersonalProject() {
	getPersonalProjectMenuItem().click();
}

export function createFolderFromListHeaderButton(folderName: string) {
	getAddFolderButton().click();
	createNewFolder(folderName);
}

export function createWorkflowFromEmptyState(workflowName?: string) {
	cy.getByTestId('empty-folder-container').find('button').contains('Create Workflow').click();
	if (workflowName) {
		cy.getByTestId('workflow-name-input').type(`{selectAll}{backspace}${workflowName}`, { delay: 50 });
	}
	cy.getByTestId('workflow-save-button').click();
	successToast().should('exist');
}

export function duplicateWorkflowFromCardActions(workflowName: string, duplicateName: string) {
	getWorkflowCardActions(workflowName).click();
	getWorkflowCardActionItem(workflowName, 'duplicate').click();
	getDuplicateWorkflowModal().find('input').first().type(`{selectAll}${duplicateName}`);
	getDuplicateWorkflowModal().find('button').contains('Duplicate').click();
	errorToast().should('not.exist');
}

/* =========================================================================
 * Utils
 * ========================================================================= */
function createNewFolder(name: string) {
	cy.intercept('POST', '/rest/projects/**').as('createFolder');
	cy.get('[role=dialog]').filter(':visible').within(() => {
		cy.get('input.el-input__inner').type(name, { delay: 50 });
		cy.get('button.btn--confirm').click();
	});
	cy.wait('@createFolder');
	successToast().should('exist');
}

function getWorkflowCardActionItem(workflowName: string, actionName: string) {
	return getWorkflowCardActions(workflowName)
		.find('span[aria-controls]')
		.invoke('attr', 'aria-controls')
		.then((popperId) => {
			return cy.get(`#${popperId}`).find(`[data-test-id="action-${actionName}"]`);
		});
}
