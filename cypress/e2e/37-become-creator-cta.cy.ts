import {
	getBecomeTemplateCreatorCta,
	getCloseBecomeTemplateCreatorCtaButton,
	interceptCtaRequestWithResponse,
} from '../composables/becomeTemplateCreatorCta';
import { WorkflowsPage as WorkflowsPageClass } from '../pages/workflows';

const WorkflowsPage = new WorkflowsPageClass();

describe('🎨 Become Template Creator CTA', () => {
	it('🛑 Should NOT show CTA when user is NOT eligible', () => {
		cy.log('🧪 Intercepting CTA request with eligibility = false');
		interceptCtaRequestWithResponse(false).as('cta');

		cy.log('📄 Visiting workflows page');
		cy.visit(WorkflowsPage.url);

		cy.log('🕸️ Waiting for CTA response');
		cy.wait('@cta');

		cy.log('👀 Verifying CTA is NOT visible');
		getBecomeTemplateCreatorCta().should('not.exist');
	});

	it('✅ Should show and dismiss CTA when user IS eligible', () => {
		cy.log('🧪 Intercepting CTA request with eligibility = true');
		interceptCtaRequestWithResponse(true).as('cta');

		cy.log('📄 Visiting workflows page');
		cy.visit(WorkflowsPage.url);

		cy.log('🕸️ Waiting for CTA response');
		cy.wait('@cta');

		cy.log('👁️ Verifying CTA is visible');
		getBecomeTemplateCreatorCta().should('be.visible');

		cy.log('❌ Clicking close CTA button');
		getCloseBecomeTemplateCreatorCtaButton().click();

		cy.log('🔒 CTA should no longer be visible');
		getBecomeTemplateCreatorCta().should('not.exist');
	});
});
