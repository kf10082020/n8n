/**
 * NDV (Node Details View) Composables — Cypress helpers for working with the NDV UI.
 */

import { getVisiblePopper, getVisibleSelect } from '../utils/popper';

/// <reference types="cypress" />

/* ============================================================================
 * Getters
 * ============================================================================
 */

// Containers
export const getNdvContainer = () => cy.getByTestId('ndv');
export const getMainPanel = () => cy.getByTestId('node-parameters');
export const getInputPanel = () => cy.getByTestId('ndv-input-panel');
export const getOutputPanel = () => cy.getByTestId('output-panel');

// Buttons
export const getExecuteNodeButton = () => cy.getByTestId('node-execute-button');
export const getBackToCanvasButton = () => cy.getByTestId('back-to-canvas');
export const getCreateNewCredentialOption = () => cy.getByTestId('node-credentials-select-item-new');

// Credentials
export const getCredentialSelect = (index = 0) =>
	cy.getByTestId('node-credentials-select').eq(index);

// Parameters
export const getParameterInputByName = (name: string) =>
	cy.getByTestId(`parameter-input-${name}`);

// Resource Locator
export const getResourceLocator = (param: string) =>
	cy.getByTestId(`resource-locator-${param}`);

export const getResourceLocatorInput = (param: string) =>
	getResourceLocator(param).find('[data-test-id="rlc-input-container"]');

// Input Table
export const getInputPanelDataContainer = () =>
	getInputPanel().findChildByTestId('ndv-data-container');

export const getInputTableRows = () =>
	getInputPanelDataContainer().find('table tr');

export const getInputTbodyCell = (row: number, col: number) =>
	getInputTableRows().eq(row).find('td').eq(col);

// Output Table
export const getOutputPanelDataContainer = () =>
	getOutputPanel().findChildByTestId('ndv-data-container');

export const getOutputTableRows = () =>
	getOutputPanelDataContainer().find('table tr');

export const getOutputTbodyCell = (row: number, col: number) =>
	getOutputTableRows().eq(row).find('td').eq(col);

export const getOutputTableHeaderByText = (text: string) =>
	getOutputPanelDataContainer().find('table thead th').contains(text);

// Misc
export const getRunDataInfoCallout = () => cy.getByTestId('run-data-callout');
export const getNodeOutputHint = () => cy.getByTestId('ndv-output-run-node-hint');
export const getNodeOutputErrorMessage = () =>
	getOutputPanel().findChildByTestId('node-error-message');
export const getParameterExpressionPreviewValue = () =>
	cy.getByTestId('parameter-expression-preview-value');

/* ============================================================================
 * Actions
 * ============================================================================
 */

export const openCredentialSelect = (index = 0) =>
	getCredentialSelect(index).click();

export const setCredentialByName = (name: string) => {
	openCredentialSelect();
	getCredentialSelect().contains(name).click();
};

export const clickCreateNewCredential = () => {
	openCredentialSelect();
	getCreateNewCredentialOption().click({ force: true });
};

export const clickExecuteNode = () =>
	getExecuteNodeButton().click();

export const clickBackToCanvas = () =>
	getBackToCanvasButton().click();

export const clickResourceLocatorInput = (param: string) =>
	getResourceLocatorInput(param).click();

export const setParameterInputByName = (name: string, value: string) =>
	getParameterInputByName(name).clear().type(value);

export const checkParameterCheckboxInputByName = (name: string) =>
	getParameterInputByName(name).find('input[type="checkbox"]').check({ force: true });

export const uncheckParameterCheckboxInputByName = (name: string) =>
	getParameterInputByName(name).find('input[type="checkbox"]').uncheck({ force: true });

export const setParameterSelectByContent = (name: string, content: string) => {
	getParameterInputByName(name).realClick();
	getVisibleSelect().find('.option-headline').contains(content).click();
};

export const selectResourceLocatorItem = (resourceLocator: string, index: number, expectedText: string) => {
	clickResourceLocatorInput(resourceLocator);
	getVisiblePopper().findChildByTestId('rlc-item').eq(index).find('span')
		.should('contain.text', expectedText).click();
};

export const selectResourceLocatorAddResourceItem = (resourceLocator: string, expectedText: string) => {
	clickResourceLocatorInput(resourceLocator);
	getVisiblePopper().findChildByTestId('rlc-item-add-resource').eq(0).find('span')
		.should('contain.text', expectedText).click();
};

/**
 * Assert content inside the output table
 */
export const assertOutputTableContent = (expected: unknown[][]) => {
	for (const [rowIdx, row] of expected.entries()) {
		for (const [colIdx, val] of row.entries()) {
			getOutputTbodyCell(1 + rowIdx, colIdx).should('have.text', val);
		}
	}
};

export const assertNodeOutputHintExists = () =>
	getNodeOutputHint().should('exist');

export const assertNodeOutputErrorMessageExists = () =>
	getNodeOutputErrorMessage().should('exist');

export const assertInlineExpressionValid = () =>
	cy.getByTestId('inline-expression-editor-input')
		.find('.cm-valid-resolvable')
		.should('exist');

export const setInputDisplayMode = (mode: 'Schema' | 'Table' | 'JSON' | 'Binary') =>
	getInputPanel().findChildByTestId('ndv-run-data-display-mode').contains(mode).click();

export const toggleInputRunLinking = () =>
	getInputPanel().findChildByTestId('link-run').click();
