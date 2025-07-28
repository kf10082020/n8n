/**
 * Node Creator - Cypress Functional Composables
 *
 * Переработано из class-based подхода NodeCreator → чистые функции
 */

/// <reference types="cypress" />

// === Getters ===

export const getPlusButton = () => cy.getByTestId('node-creator-plus-button');
export const getCanvasAddButton = () => cy.getByTestId('canvas-add-button');
export const getSearchBar = () => cy.getByTestId('search-bar');

export const getCategoryItemByLabel = (label: string) =>
	cy.get(`[data-keyboard-nav-id="${label}"]`);

export const getCreatorItems = () => cy.getByTestId('item-iterator-item');

export const getCreatorItemByLabel = (label: string) =>
	getCreatorItems()
		.contains(label)
		.parents('[data-test-id="item-iterator-item"]');

export const getNthCreatorItem = (index: number) =>
	getCreatorItems().eq(index);

export const getNodeCreator = () => cy.getByTestId('node-creator');
export const getNodeCreatorTabs = () => cy.getByTestId('node-creator-type-selector');
export const getSelectedTab = () => getNodeCreatorTabs().find('.is-active');
export const getCategorizedItems = () => cy.getByTestId('categorized-items');
export const getCategoryItems = () => cy.getByTestId('node-creator-category-item');
export const getCommunityNodeTooltip = () => cy.getByTestId('node-item-community-tooltip');
export const getNoResultsMessage = () => cy.getByTestId('node-creator-no-results');
export const getNodeItemNames = () => cy.getByTestId('node-creator-item-name');
export const getNodeItemDescriptions = () => cy.getByTestId('node-creator-item-description');
export const getActiveSubcategory = () => cy.getByTestId('nodes-list-header');
export const getExpandedCategoriesText = () =>
	getCreatorItems().find('>div').filter('.active').invoke('text');

// === Actions ===

export const openNodeCreator = () => {
	getPlusButton().click();
	getNodeCreator().should('be.visible');
};

export const selectNodeByName = (name: string) => {
	getCreatorItemByLabel(name).click();
};
