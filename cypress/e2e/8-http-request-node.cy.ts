import { WorkflowPage, NDV } from '../pages';
import { NodeCreator } from '../pages/features/node-creator';

const workflowPage = new WorkflowPage();
const nodeCreatorFeature = new NodeCreator();
const ndv = new NDV();

// 🧪 HTTP Request Node E2E Tests
// Covers basic usage and behavior for credential-only variants

describe('🛰️ HTTP Request node', () => {
	beforeEach(() => {
		cy.log('🔄 Visiting workflow page');
		workflowPage.actions.visit();
	});

	it('🌐 should make a request with a URL and receive a response', () => {
		cy.log('➕ Adding Manual trigger and HTTP Request node');
		workflowPage.actions.addInitialNodeToCanvas('Manual');
		workflowPage.actions.addNodeToCanvas('HTTP Request');

		cy.log('🧩 Opening HTTP Request node');
		workflowPage.actions.openNode('HTTP Request');
		ndv.actions.typeIntoParameterInput('url', 'https://catfact.ninja/fact');

		cy.log('▶️ Executing node');
		ndv.actions.execute();

		cy.log('📦 Validating output contains "fact"');
		ndv.getters.outputPanel().contains('fact');
	});

	describe('🔐 Credential-only HTTP Request Node variants', () => {
		it('🔍 should render a modified HTTP Request Node', () => {
			workflowPage.actions.addInitialNodeToCanvas('Manual');

			cy.log('➕ Opening node creator and searching "VirusTotal"');
			workflowPage.getters.nodeCreatorPlusButton().click();
			workflowPage.getters.nodeCreatorSearchBar().type('VirusTotal');

			cy.log('✅ Verifying VirusTotal option exists');
			nodeCreatorFeature.getters.nodeItemName().first().should('have.text', 'VirusTotal');
			nodeCreatorFeature.getters.nodeItemDescription().first().should('have.text', 'HTTP request');

			cy.log('📦 Selecting VirusTotal node');
			nodeCreatorFeature.actions.selectNode('VirusTotal');

			cy.log('🧾 Checking VirusTotal node defaults');
			ndv.getters.nodeNameContainer().should('contain.text', 'VirusTotal HTTP Request');
			ndv.getters.parameterInput('url').find('input').should('contain.value', 'https://www.virustotal.com/api/v3/');

			cy.log('🙈 Hidden fields check (authentication, credentials)');
			ndv.getters.parameterInput('authentication').should('not.exist');
			ndv.getters.parameterInput('nodeCredentialType').should('not.exist');

			cy.log('🔐 Verifying credentials label');
			workflowPage.getters.nodeCredentialsLabel().should('contain.text', 'Credential for VirusTotal');
		});
	});
});
