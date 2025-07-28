/**
 * Workflows Canvas Composable
 */

//////////////////////////////
// Types
//////////////////////////////

export type EndpointType =
	| 'main'
	| 'ai_chain'
	| 'ai_document'
	| 'ai_embedding'
	| 'ai_languageModel'
	| 'ai_memory'
	| 'ai_outputParser'
	| 'ai_tool'
	| 'ai_retriever'
	| 'ai_textSplitter'
	| 'ai_vectorRetriever'
	| 'ai_vectorStore';

//////////////////////////////
// Canvas Elements
//////////////////////////////

export const getCanvas = () => cy.getByTestId('canvas');
export const getCanvasPane = () => getCanvas().find('.vue-flow__pane');
export const getNodes = () => cy.getByTestId('canvas-node');
export const getNodeByName = (name: string) => getNodes().filter(`[data-node-name="${name}"]`).eq(0);
export const getCanvasNodeByName = (name: string) => getNodes().filter(`:contains(${name})`);

//////////////////////////////
// Handles & Connections
//////////////////////////////

export const getInputPlusHandle = (name: string) =>
	cy.get(`[data-test-id="canvas-node-input-handle"][data-node-name="${name}"] [data-test-id="canvas-handle-plus"]`);

export const getInputPlusHandleByType = (name: string, type: EndpointType) =>
	cy.get(`[data-test-id="canvas-node-input-handle"][data-node-name="${name}"][data-connection-type="${type}"] [data-test-id="canvas-handle-plus"]`);

export const getOutputPlusHandle = (name: string) =>
	cy.get(`[data-test-id="canvas-node-output-handle"][data-node-name="${name}"] [data-test-id="canvas-handle-plus"]`);

export const getOutputPlusHandleByType = (name: string, type: EndpointType) =>
	cy.get(`[data-test-id="canvas-node-output-handle"][data-node-name="${name}"][data-connection-type="${type}"] [data-test-id="canvas-handle-plus"]`);

export const getConnectionBySourceAndTarget = (source: string, target: string) =>
	cy.getByTestId('edge').filter(`[data-source-node-name="${source}"][data-target-node-name="${target}"]`).eq(0);

//////////////////////////////
// Workflow Controls
//////////////////////////////

export const getExecuteWorkflowButton = (name?: string) =>
	cy.getByTestId(`execute-workflow-button${name ? `-${name}` : ''}`);
export const getSaveButton = () => cy.getByTestId('workflow-save-button');
export const clickExecuteWorkflowButton = (name?: string) => getExecuteWorkflowButton(name).click();
export const saveWorkflowOnButtonClick = () => {
	cy.intercept('POST', '/rest/workflows').as('createWorkflow');
	getSaveButton().click();
	cy.url().should('not.have.string', '/new');
};

//////////////////////////////
// Node Actions
//////////////////////////////

export const addNodeToCanvas = (name: string, useExact = false) => {
	cy.getByTestId('node-creator-plus-button').click();
	cy.getByTestId('node-creator-search-bar').type(name);
	useExact
		? cy.getByTestId('node-creator-item-name').contains(name).click()
		: cy.getByTestId('node-creator-search-bar').type('{enter}');
	cy.wait(300);
	cy.get('body').type('{esc}');
};

export const deleteNode = (name: string) => {
	getCanvasNodeByName(name).first().click();
	cy.get('body').type('{del}');
};

//////////////////////////////
// Context Menu
//////////////////////////////

export const openContextMenu = (name: string) => {
	getNodeByName(name).rightclick('center', { force: true });
	cy.getByTestId('context-menu').find('.el-dropdown-menu').should('be.visible');
};

export const clickContextMenuAction = (action: string) => {
	cy.getByTestId(`context-menu-item-${action}`).click({ force: true });
};

//////////////////////////////
// Keyboard Shortcuts
//////////////////////////////

export const hitShortcut = (combo: string) => cy.get('body').type(combo);
export const hitUndo = () => hitShortcut('{meta}z');
export const hitRedo = () => hitShortcut('{meta+shift+z}');
export const hitSaveWorkflow = () => hitShortcut('{meta+s}');
export const hitExecuteWorkflow = () => hitShortcut('{meta+enter}');
export const hitDeleteAll = () => {
	hitShortcut('{meta}a');
	hitShortcut('{backspace}');
};
