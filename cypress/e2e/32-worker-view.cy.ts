import { WorkerViewPage } from '../pages';

const workerViewPage = new WorkerViewPage();

describe('🛠 Worker View', () => {
	context('🔒 Unlicensed Mode', () => {
		beforeEach(() => {
			cy.log('🧪 Disable worker view & queue mode');
			cy.disableFeature('workerView');
			cy.disableQueueMode();
			cy.signinAsMember(0);
		});

		it('should not show menu item in sidebar', () => {
			cy.visit(workerViewPage.url);
			workerViewPage.getters.menuItem().should('not.exist');
		});

		it('should show unlicensed action box', () => {
			cy.visit(workerViewPage.url);
			workerViewPage.getters.workerViewUnlicensed().should('exist');
		});
	});

	context('✅ Licensed Mode', () => {
		beforeEach(() => {
			cy.log('✅ Enable worker view & queue mode');
			cy.enableFeature('workerView');
			cy.enableQueueMode();
		});

		it('should show menu item in sidebar', () => {
			cy.signinAsOwner();
			cy.visit(workerViewPage.url);
			workerViewPage.getters.menuItem().should('exist');
		});

		it('should show licensed worker list view', () => {
			cy.signinAsMember(0);
			cy.visit(workerViewPage.url);
			workerViewPage.getters.workerViewLicensed().should('exist');
		});
	});
});
