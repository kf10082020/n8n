import OnboardingWorkflow from '../fixtures/Onboarding_workflow.json';
import WorkflowTemplate from '../fixtures/Workflow_template_write_http_query.json';
import { MainSidebar } from '../pages/sidebar/main-sidebar';
import { TemplatesPage } from '../pages/templates';
import { WorkflowPage } from '../pages/workflow';
import { WorkflowsPage } from '../pages/workflows';

const templatesPage = new TemplatesPage();
const workflowPage = new WorkflowPage();
const workflowsPage = new WorkflowsPage();
const mainSidebar = new MainSidebar();

function getNumberFromText(text: string): number {
	return parseInt(text.replace(/\D/g, ''), 10);
}

describe('🧩 Workflow Templates — Integration, Search, Import, Onboarding', () => {
	const mockTemplateHost = (host: string) => {
		cy.overrideSettings({
			templates: { enabled: true, host },
		});
	};

	describe('🌐 Website (n8n.io) integration', () => {
		beforeEach(() => {
			mockTemplateHost('https://api.n8n.io/api/');
		});

		it('🔗 Sidebar templates link opens website with params', () => {
			cy.visit(workflowsPage.url);
			mainSidebar.getters.templates().should('be.visible');

			mainSidebar.getters.templates().parent('a').should('have.attr', 'href').and('include', 'https://n8n.io/workflows');

			mainSidebar.getters.templates().parent('a').then(($a) => {
				const href = $a.attr('href') ?? '';
				const params = new URLSearchParams(href);
				expect(decodeURIComponent(`${params.get('utm_instance')}`)).to.include(window.location.origin);
				expect(params.get('utm_n8n_version')).to.match(/[0-9]+\.[0-9]+\.[0-9]+/);
				expect(params.get('utm_awc')).to.match(/[0-9]+/);
			});
			mainSidebar.getters.templates().parent('a').should('have.attr', 'target', '_blank');
		});

		it('➡️ Redirects to website from /templates', () => {
			cy.intercept({ hostname: 'n8n.io', pathname: '/workflows' }, 'Mock Template Page').as('templatesPage');
			cy.visit(templatesPage.url);
			cy.wait('@templatesPage');
		});
	});

	describe('🏗 Custom template host', () => {
		const hostname = 'random.domain';
		const categories = [
			{ id: 1, name: 'Engineering' },
			{ id: 2, name: 'Finance' },
			{ id: 3, name: 'Sales' },
		];
		const collections = [
			{ id: 1, name: 'Test Collection', workflows: [{ id: 1 }], nodes: [] },
		];

		beforeEach(() => {
			cy.intercept({ hostname, pathname: '/api/health' }, { status: 'OK' });
			cy.intercept({ hostname, pathname: '/api/templates/categories' }, { categories });
			cy.intercept({ hostname, pathname: '/api/templates/collections', query: { category: '**' } }, (req) => {
				req.reply({ collections: req.query['category[]'] === '3' ? [] : collections });
			});
			cy.intercept({ hostname, pathname: '/api/templates/search', query: { category: '**' } }, (req) => {
				const fixture = req.query.category === 'Sales' ? 'templates_search/sales_templates_search_response.json' : 'templates_search/all_templates_search_response.json';
				req.reply({ statusCode: 200, fixture });
			});
			cy.intercept({ hostname, pathname: '/api/workflows/templates/1' }, {
				statusCode: 200,
				body: { id: 1, name: OnboardingWorkflow.name, workflow: OnboardingWorkflow },
			}).as('getTemplate');
			cy.intercept({ hostname, pathname: '/api/templates/workflows/1' }, {
				statusCode: 200,
				body: WorkflowTemplate,
			}).as('getTemplatePreview');
			mockTemplateHost(`https://${hostname}/api`);
		});

		it('🧭 Opens onboarding flow', () => {
			templatesPage.actions.openOnboardingFlow();
			cy.url().should('match', /.*\/workflow\/.*?onboardingId=1$/);
			workflowPage.actions.shouldHaveWorkflowName('Demo: ' + OnboardingWorkflow.name);
			workflowPage.getters.canvasNodes().should('have.length', 4);
			workflowPage.getters.stickies().should('have.length', 1);
		});

		it('📥 Imports template correctly', () => {
			templatesPage.actions.importTemplate();
			cy.url().should('include', '/workflow/new?templateId=1');
			workflowPage.getters.canvasNodes().should('have.length', 4);
			workflowPage.getters.stickies().should('have.length', 1);
			workflowPage.actions.shouldHaveWorkflowName(OnboardingWorkflow.name);
		});

		it('💾 Saves template id with workflow', () => {
			cy.intercept('POST', '/rest/workflows').as('saveWorkflow');
			templatesPage.actions.importTemplate();
			workflowPage.actions.saveWorkflowOnButtonClick();
			workflowPage.actions.hitSelectAll();
			workflowPage.actions.hitCopy();
			cy.wait('@saveWorkflow').then((interception) => {
				expect(interception.request.body.meta.templateId).to.equal('1');
			});
		});

		it('🖼 Opens template with image preview', () => {
			cy.visit(`${templatesPage.url}/1`);
			cy.wait('@getTemplatePreview');
			templatesPage.getters.description().find('img').should('have.length', 1);
		});

		it('🔍 Renders search UI correctly', () => {
			cy.visit(templatesPage.url);
			templatesPage.getters.searchInput().should('exist');
			templatesPage.getters.allCategoriesFilter().should('exist');
			templatesPage.getters.categoryFilters().should('have.length.greaterThan', 1);
			templatesPage.getters.templateCards().should('have.length.greaterThan', 0);
		});

		it('📂 Filters templates by category', () => {
			cy.visit(templatesPage.url);
			let initialTemplateCount = 0;
			let initialCollectionCount = 0;

			cy.wrap(null).then(() => templatesPage.getters.templateCountLabel().invoke('text')).then((text) => {
				initialTemplateCount = getNumberFromText(text);
				return templatesPage.getters.collectionCountLabel().invoke('text');
			}).then((text) => {
				initialCollectionCount = getNumberFromText(text);
				templatesPage.getters.categoryFilter('sales').click();
				templatesPage.getters.templatesLoadingContainer().should('not.exist');
				templatesPage.getters.templateCountLabel().invoke('text').should((newText) => {
					expect(getNumberFromText(newText)).to.be.lessThan(initialTemplateCount);
				});
				templatesPage.getters.collectionCountLabel().invoke('text').should((newText) => {
					expect(getNumberFromText(newText)).to.be.lessThan(initialCollectionCount);
				});
			});
		});

		it('🔗 Preserves search query in URL after reload', () => {
			cy.visit(templatesPage.url);
			templatesPage.getters.categoryFilter('sales').click();
			templatesPage.getters.searchInput().type('auto');
			cy.url().should('include', '?categories=').and('include', '&search=');
			cy.reload();
			cy.url().should('include', '?categories=').and('include', '&search=');
			templatesPage.getters.categoryFilter('sales').find('label').should('have.class', 'is-checked');
			templatesPage.getters.searchInput().should('have.value', 'auto');
			templatesPage.getters.categoryFilters().eq(1).invoke('text').should('equal', 'Sales');
		});
	});
});
