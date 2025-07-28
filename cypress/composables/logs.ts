/**
 * Logs Composables — Cypress helpers for interacting with the logs panel,
 * including input/output tables and execution entries.
 */

/// <reference types="cypress" />

/* ============================================================================
 * Panel Accessors
 * ============================================================================
 */

/** Returns the logs overview panel container */
export const getOverviewPanel = () => cy.getByTestId('logs-overview');

/** Returns the body section of the overview panel */
export const getOverviewPanelBody = () => cy.getByTestId('logs-overview-body');

/** Returns the status section in overview */
export const getOverviewStatus = () => cy.getByTestId('logs-overview-status');

/** Gets all log entry elements (tree items) */
export const getLogEntries = () => getOverviewPanelBody().find('[role=treeitem]');

/** Gets the selected log entry (aria-selected=true) */
export const getSelectedLogEntry = () =>
	getOverviewPanelBody().find('[role=treeitem][aria-selected=true]');

/** Returns the input panel container */
export const getInputPanel = () => cy.getByTestId('log-details-input');

/** Returns the output panel container */
export const getOutputPanel = () => cy.getByTestId('log-details-output');

/** Returns the error message element inside the output panel */
export const getNodeErrorMessageHeader = () =>
	getOutputPanel().findChildByTestId('node-error-message');

/* ============================================================================
 * Input Table Accessors
 * ============================================================================
 */

/** Gets all input table rows */
export const getInputTableRows = () => getInputPanel().find('table tr');

/**
 * Gets a specific input cell by row and column index
 * @param row - Zero-based row index
 * @param col - Zero-based column index
 */
export const getInputTbodyCell = (row: number, col: number) =>
	getInputTableRows().eq(row).find('td').eq(col);

/* ============================================================================
 * Output Table Accessors
 * ============================================================================
 */

/** Gets all output table rows */
export const getOutputTableRows = () => getOutputPanel().find('table tr');

/**
 * Gets a specific output cell by row and column index
 * @param row - Zero-based row index
 * @param col - Zero-based column index
 */
export const getOutputTbodyCell = (row: number, col: number) =>
	getOutputTableRows().eq(row).find('td').eq(col);

/* ============================================================================
 * Actions
 * ============================================================================
 */

/** Opens the logs panel from the header */
export const openLogsPanel = () => cy.getByTestId('logs-overview-header').click();

/** Clicks the "Clear execution" button in the logs panel */
export const pressClearExecutionButton = () =>
	cy.getByTestId('logs-overview-header').find('button').contains('Clear execution').click();

/**
 * Clicks a log entry at the given row index
 * @param rowIndex - Zero-based index
 */
export const clickLogEntryAtRow = (rowIndex: number) =>
	getLogEntries().eq(rowIndex).click();

/** Toggles the input panel open or closed */
export const toggleInputPanel = () =>
	cy.getByTestId('log-details-header').contains('Input').click();

/**
 * Opens NDV (Node Details View) from the given log entry
 * @param rowIndex - Zero-based row index
 */
export const clickOpenNdvAtRow = (rowIndex: number) => {
	const row = getLogEntries().eq(rowIndex);
	row.realHover();
	row.find('[aria-label="Open..."]').click();
};

/**
 * Triggers partial execution from the given log entry
 * @param rowIndex - Zero-based row index
 */
export const clickTriggerPartialExecutionAtRow = (rowIndex: number) => {
	const row = getLogEntries().eq(rowIndex);
	row.realHover();
	row.find('[aria-label="Execute step"]').click();
};

/**
 * Sets the display mode in the input panel
 * @param mode - One of 'table', 'ai', 'json', 'schema'
 */
export const setInputDisplayMode = (mode: 'table' | 'ai' | 'json' | 'schema') => {
	getInputPanel().realHover();
	getInputPanel().findChildByTestId(`radio-button-${mode}`).click();
};

/**
 * Sets the display mode in the output panel
 * @param mode - One of 'table', 'ai', 'json', 'schema'
 */
export const setOutputDisplayMode = (mode: 'table' | 'ai' | 'json' | 'schema') => {
	getOutputPanel().realHover();
	getOutputPanel().findChildByTestId(`radio-button-${mode}`).click();
};
