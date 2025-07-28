import { getOutputTableRow } from '../composables/ndv';
import { getCanvasNodes, openNode } from '../composables/workflow';
import SIMPLE_WORKFLOW from '../fixtures/Manual_wait_set.json';
import WORKFLOW_WITH_PINNED from '../fixtures/Webhook_set_pinned.json';
import { importWorkflow, visitDemoPage } from '../pages/demo';
import { errorToast } from '../pages/notifications';

// ⚙️ Flexible and stable Demo tests with consistent logging and setup

describe('🧪 Demo Page Workflows', () => {
	beforeEach(() => {
		cy.log('⏱️ Overriding settings with preview mode');
		cy.overrideSettings({ previewMode: true });
	});

	it('📦 Imports a basic template with 3 nodes', () => {
		cy.log('🌐 Visiting Demo Page');
		visitDemoPage();

		cy.log('🚫 Checking for absence of error toast');
		errorToast().should('not.exist');

		cy.log('📤 Importing SIMPLE_WORKFLOW');
		importWorkflow(SIMPLE_WORKFLOW);

		cy.log('🧩 Checking canvas node count');
		getCanvasNodes().should('have.length', 3);
	});

	it('📌 Imports a workflow with pinned data and verifies nodes', () => {
		cy.log('🌐 Visiting Demo Page');
		visitDemoPage();

		cy.log('📤 Importing WORKFLOW_WITH_PINNED');
		importWorkflow(WORKFLOW_WITH_PINNED);

		cy.log('🧩 Validating node count');
		getCanvasNodes().should('have.length', 2);

		cy.log('🔍 Opening Webhook node');
		openNode('Webhook');

		cy.log('📄 Checking output rows');
		getOutputTableRow(0).should('include.text', 'headers');
		getOutputTableRow(1).should('include.text', 'dragons');
	});

	it('🌙 Applies dark theme override', () => {
		cy.log('🖤 Visiting demo page with theme=dark');
		visitDemoPage('dark');

		cy.log('🧪 Validating dark theme attribute');
		cy.get('body').should('have.attr', 'data-theme', 'dark');

		errorToast().should('not.exist');
	});

	it('🌞 Applies light theme override', () => {
		cy.log('🤍 Visiting demo page with theme=light');
		visitDemoPage('light');

		cy.log('🧪 Validating light theme attribute');
		cy.get('body').should('have.attr', 'data-theme', 'light');

		errorToast().should('not.exist');
	});
});
