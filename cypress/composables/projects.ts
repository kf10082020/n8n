import { CredentialsModal, WorkflowPage } from '../pages';
import { getVisibleSelect } from '../utils';

const workflowPage = new WorkflowPage();
const credentialsModal = new CredentialsModal();

/**
 * Navigation & Project menu
 */
export const getHomeButton = () => cy.getByTestId('project-home-menu-item');
export const getPersonalProjectsButton = () => cy.getByTestId('project-personal-menu-item');
export const getMenuItems = () => cy.getByTestId('project-menu-item');

/**
 * Add project button in main nav
 */
export const getAddProjectButton = () => {
	cy.getByTestId('universal-add').should('be.visible').click();

	cy.getByTestId('universal-add')
		.find('.el-sub-menu__title')
		.invoke('attr', 'aria-describedby')
		.then((id) => {
			cy.get(`#${id}`)
				.findByTestId('navigation-menu-item')
				.filter(':contains("Project")')
				.as('projectAddButton');
		});

	return cy.get('@projectAddButton');
};

/**
 * Add project button when no projects exist
 */
export const getAddFirstProjectButton = () => cy.getByTestId('add-first-project-button');

/**
 * Project Icon Picker
 */
export const getIconPickerButton = () => cy.getByTestId('icon-picker-button');
export const getIconPickerTab = (tab: string) =>
	cy.getByTestId('icon-picker-tabs').contains(tab);
export const getIconPickerIcons = () => cy.getByTestId('icon-picker-icon');
export const getIconPickerEmojis = () => cy.getByTestId('icon-picker-emoji');

/**
 * Project Tabs
 */
export const getProjectTabs = () => cy.getByTestId('project-tabs').find('a');
export const getProjectTabWorkflows = () => getProjectTabs().filter('a[href$="/workflows"]');
export const getProjectTabCredentials = () => getProjectTabs().filter('a[href$="/credentials"]');
export const getProjectTabExecutions = () => getProjectTabs().filter('a[href$="/executions"]');
export const getProjectTabSettings = () => getProjectTabs().filter('a[href$="/settings"]');

/**
 * Project Settings
 */
export const getProjectSettingsNameInput = () =>
	cy.getByTestId('project-settings-name-input').find('input');
export const getProjectSettingsSaveButton = () => cy.getByTestId('project-settings-save-button');
export const getProjectSettingsCancelButton = () =>
	cy.getByTestId('project-settings-cancel-button');
export const getProjectSettingsDeleteButton = () =>
	cy.getByTestId('project-settings-delete-button');

/**
 * Project Members
 */
export const getProjectMembersSelect = () => cy.getByTestId('project-members-select');

/**
 * Add member to project with optional role
 * @param email - Email of the user to add
 * @param role - Optional role (e.g., Editor, Viewer)
 */
export const addProjectMember = (email: string, role?: string) => {
	getProjectMembersSelect().click();
	getProjectMembersSelect()
		.get('.el-select-dropdown__item')
		.contains(email.toLowerCase())
		.click();

	if (role) {
		cy.getByTestId(`user-list-item-${email}`)
			.findByTestId('projects-settings-user-role-select')
			.click();

		getVisibleSelect().find('li').contains(role).click();
	}
};

/**
 * Resource/Folder Move Modals
 */
export const getResourceMoveModal = () => cy.getByTestId('project-move-resource-modal');
export const getProjectMoveSelect = () => cy.getByTestId('project-move-resource-modal-select');
export const getProjectSharingSelect = () => cy.getByTestId('project-sharing-select');
export const getMoveToFolderSelect = () => cy.getByTestId('move-to-folder-dropdown');

/**
 * Create new project via UI
 * @param name - Name of the new project
 */
export function createProject(name: string) {
	getAddProjectButton().click();
	getProjectSettingsNameInput().should('be.visible').clear().type(name);
	getProjectSettingsSaveButton().click();
}

/**
 * Create workflow from fixture file
 * @param fixtureKey - Filename in fixtures folder
 * @param name - Desired workflow name
 */
export function createWorkflow(fixtureKey: string, name: string) {
	workflowPage.getters.workflowImportInput().selectFile(`fixtures/${fixtureKey}`, { force: true });
	workflowPage.actions.setWorkflowName(name);
	workflowPage.getters.saveButton().should('contain', 'Saved');
	workflowPage.actions.zoomToFit();
}

/**
 * Create a Notion credential
 * @param name - Credential name
 * @param closeModal - Whether to close the modal after creation
 */
export function createCredential(name: string, closeModal = true) {
	credentialsModal.getters.newCredentialModal().should('be.visible');
	credentialsModal.getters.newCredentialTypeSelect().should('be.visible');
	credentialsModal.getters.newCredentialTypeOption('Notion API').click();
	credentialsModal.getters.newCredentialTypeButton().click();
	credentialsModal.getters.connectionParameter('Internal Integration Secret').type('1234567890');
	credentialsModal.actions.setName(name);
	credentialsModal.actions.save();

	if (closeModal) {
		credentialsModal.actions.close();
	}
}
