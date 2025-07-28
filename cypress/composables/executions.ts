/**
 * Executions Composable — Cypress helpers for interacting with the execution preview iframe and logs UI.
 */

/// <reference types="cypress" />

/* =========================================================================
 * Getters
 * ========================================================================= */

/** Returns the executions sidebar element */
export const getExecutionsSidebar = () => cy.getByTestId('executions-sidebar');

/** Returns the iframe element used for workflow preview */
export const getWorkflowExecutionPreviewIframe = () => cy.getByTestId('workflow-preview-iframe');

/** Returns the body of the execution preview iframe, wrapped in Cypress chain */
export const getExecutionPreviewBody = () =>
	getWorkflowExecutionPreviewIframe()
		.its('0.contentDocument.body')
		.should((body) => {
			expect(body.querySelector('[data-test-id="canvas-wrapper"]')).to.exist;
		})
		.then((el) => cy.wrap(el));

/** Returns all canvas node elements inside preview */
export const getExecutionPreviewBodyNodes = () =>
	getExecutionPreviewBody().findChildByTestId('canvas-node');

/** Returns a specific canvas node in preview by name */
export const getExecutionPreviewBodyNodesByName = (name: string) =>
	getExecutionPreviewBody().findChildByTestId('canvas-node').filter(`[data-name="${name}"]`).eq(0);

/** Returns link to related execution from output panel */
export const getExecutionPreviewOutputPanelRelatedExecutionLink = () =>
	getExecutionPreviewBody().findChildByTestId('related-execution-link');

/** Returns the logs overview status */
export const getLogsOverviewStatus = () =>
	getExecutionPreviewBody().findChildByTestId('logs-overview-status');

/** Returns all log entries in the logs panel */
export const getLogEntries = () =>
	getExecutionPreviewBody().findChildByTestId('logs-overview-body').find('[role=treeitem]');

/** Returns all manual chat messages shown in preview */
export const getManualChatMessages = () =>
	getExecutionPreviewBody().find('.chat-messages-list .chat-message');

/* =========================================================================
 * Actions
 * ========================================================================= */

/** Double-clicks on a node in execution preview by name */
export const openExecutionPreviewNode = (name: string) =>
	getExecutionPreviewBodyNodesByName(name).dblclick();

/** Toggles the auto-refresh checkbox */
export const toggleAutoRefresh = () =>
	cy.getByTestId('auto-refresh-checkbox').click();
