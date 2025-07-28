/**
 * Node Creator composable — provides getters and actions to interact with the node creator UI.
 * Used in visual workflow editor tests.
 */

/// <reference types="cypress" />

/* ============================================================================
 * Getters
 * ============================================================================
 */

/** Plus button to open node creator */
export const nodeCreatorPlusButton = () => cy.getByTestId('node-creator-plus-button');

/** Add button on the canvas */
export const canvasAddButton = () => cy.getByTestId('canvas-add-button');

/** Search bar in node creator */
export const searchBar = () => cy.getByTestId('search-bar');

/**
 * Gets category item by its keyboard nav ID (e.g., label)
 * @param label - The ID label of the category
 */
export const getCategoryItem = (label: string) =>
	cy.get(`[data-keyboard-nav-id="${label}"]`);

/**
 * Returns the full DOM element for a creator item (node) by label
 * @param label - Display label of the node
 */
export const getCreatorItem = (label: string) =>
	getCreatorItems().contains(label).parents('[data-test-id="item-iterator-item"]');

/**
 * Gets the N-th node creator item (zero-based index)
 * @param n - Index of the item
 */
export const getNthCreatorItem = (n: number) =>
	getCreatorItems().eq(n);

/** Entire node creator modal */
export const nodeCreator = () => cy.getByTestId('node-creator');

/** Tabs inside node creator (e.g., Regular / Community / Custom nodes) */
export const nodeCreatorTabs = () => cy.getByTestId('node-creator-type-selector');

/** Currently selected tab element */
export const selectedTab = () => nodeCreatorTabs().find('.is-active');

/** Categorized section in node creator */
export const categorizedItems = () => cy.getByTestId('categorized-items');

/** List of all visible node creator items */
export const getCreatorItems = () => cy.getByTestId('item-iterator-item');

/** Each category item container */
export const categoryItem = () => cy.getByTestId('node-creator-category-item');

/** Tooltip element for community node */
export const communityNodeTooltip = () => cy.getByTestId('node-item-community-tooltip');

/** "No results" message block */
export const noResults = () => cy.getByTestId('node-creator-no-results');

/** Node name label element */
export const nodeItemName = () => cy.getByTestId('node-creator-item-name');

/** Node description element */
export const nodeItemDescription = () => cy.getByTestId('node-creator-item-description');

/** Active subcategory title in the current view */
export const activeSubcategory = () => cy.getByTestId('nodes-list-header');

/**
 * Text values of expanded categories
 * Returns a chainable invoking `.text()` from expanded ones
 */
export const expandedCategories = () =>
	getCreatorItems().find('>div').filter('.active').invoke('text');

/* ============================================================================
 * Actions
 * ============================================================================
 */

/**
 * Opens the node creator modal using the plus button.
 * Ensures the modal is visible.
 */
export const openNodeCreator = () => {
	nodeCreatorPlusButton().click();
	nodeCreator().should('be.visible');
};

/**
 * Selects a node from the list by its display name.
 * @param displayName - Visible name of the node to select
 */
export const selectNode = (displayName: string) => {
	getCreatorItem(displayName).click();
};
