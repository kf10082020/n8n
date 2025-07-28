import { WorkflowsPage } from '../pages';

const workflowsPage = new WorkflowsPage();

const TEST_INSTANCE_ID = 'test-instance-id';

describe('n8n.io iframe (telemetry-controlled)', () => {
	beforeEach(() => {
		cy.log('🎯 Visiting workflows page');
	});

	context('🛑 When telemetry is disabled', () => {
		it('should NOT load the iframe on /home/workflows', () => {
			cy.log('⚙️ Disabling telemetry via settings');
			cy.overrideSettings({ telemetry: { enabled: false } });

			cy.visit(workflowsPage.url);

			cy.log('❌ Ensuring no iframe is present');
			cy.get('iframe').should('not.exist');
		});
	});

	context('✅ When telemetry is enabled', () => {
		it('should load the iframe on /home/workflows with correct URL', () => {
			const testUserId = Cypress.env('currentUserId');
			const iframeUrl = `https://n8n.io/self-install?instanceId=${TEST_INSTANCE_ID}&userId=${testUserId}`;

			cy.log('⚙️ Enabling telemetry and injecting test instanceId');
			cy.overrideSettings({ telemetry: { enabled: true }, instanceId: TEST_INSTANCE_ID });

			cy.intercept(iframeUrl, (req) => req.reply(200)).as('iframeRequest');

			cy.visit(workflowsPage.url);

			cy.log('🧩 Waiting for iframe to be loaded with correct src');
			cy.get('iframe')
				.should('exist')
				.and('have.attr', 'src')
				.and('include', TEST_INSTANCE_ID)
				.and('include', testUserId);

			cy.log('🛰️ Verifying request to iframe');
			cy.wait('@iframeRequest').its('response.statusCode').should('eq', 200);

			// Optional: snapshot visual state
			// cy.percySnapshot?.('Iframe telemetry enabled');
		});
	});
});
