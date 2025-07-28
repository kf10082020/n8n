import {
	closeVersionUpdatesPanel,
	getVersionCard,
	getVersionUpdatesPanelOpenButton,
	openVersionUpdatesPanel,
} from '../composables/versions';
import { WorkflowsPage } from '../pages/workflows';

const workflowsPage = new WorkflowsPage();

describe('📦 Version Updates Panel', () => {
	it('should open and close the version updates panel', () => {
		cy.log('🔧 Overriding settings with version info and enabled notifications');
		cy.overrideSettings({
			releaseChannel: 'stable',
			versionCli: '1.0.0',
			versionNotifications: {
				enabled: true,
				endpoint: 'https://api.n8n.io/api/versions/',
				infoUrl: 'https://docs.n8n.io/getting-started/installation/updating.html',
			},
		});

		cy.log('📄 Visiting workflows page');
		cy.visit(workflowsPage.url);

		cy.log('🕸️ Waiting for settings to load');
		cy.wait('@loadSettings');

		cy.log('🟢 Checking that updates panel button is visible with correct label');
		getVersionUpdatesPanelOpenButton().should('contain', '2 updates');

		cy.log('📂 Opening version updates panel');
		openVersionUpdatesPanel();

		cy.log('🧩 Checking that two version cards are displayed');
		getVersionCard().should('have.length', 2);

		cy.log('❌ Closing version updates panel');
		closeVersionUpdatesPanel();
	});
});
