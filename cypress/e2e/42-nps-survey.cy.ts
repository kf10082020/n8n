import { INSTANCE_ADMIN } from '../constants';
import { clearNotifications } from '../pages/notifications';
import {
	getNpsSurvey,
	getNpsSurveyClose,
	getNpsSurveyEmail,
	getNpsSurveyRatings,
} from '../pages/npsSurvey';
import { WorkflowPage } from '../pages/workflow';

const workflowPage = new WorkflowPage();

// Time constants
const NOW = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;
const THREE_DAYS = ONE_DAY * 3;
const SEVEN_DAYS = ONE_DAY * 7;
const SIX_MONTHS = 30 * ONE_DAY * 6 + ONE_DAY;

const enableTelemetryStub = () => {
	cy.intercept('/rest/settings', { middleware: true }, (req) => {
		req.on('response', (res) => {
			if (res.body.data) {
				res.body.data.telemetry = {
					enabled: true,
					config: {
						key: 'test',
						url: 'https://telemetry-test.n8n.io',
					},
				};
			}
		});
	});

	cy.intercept('/rest/login', { middleware: true }, (req) => {
		req.on('response', (res) => {
			if (res.body.data) {
				res.body.data.settings ??= {};
				res.body.data.settings.userActivated = true;
				res.body.data.settings.userActivatedAt = NOW - THREE_DAYS - 1000;
			}
		});
	});
};

describe('🧠 NPS Survey Flow', () => {
	beforeEach(() => {
		cy.resetDatabase();
		cy.signin(INSTANCE_ADMIN);
		enableTelemetryStub();
	});

	it('📨 Displays and submits NPS survey after activation', () => {
		cy.log('🚀 Visiting for first time (3 days after activation)');
		workflowPage.actions.visit(true, NOW);
		workflowPage.actions.saveWorkflowOnButtonClick();

		cy.log('✅ Checking if NPS is visible and interacts');
		getNpsSurvey().should('be.visible');
		getNpsSurveyRatings().find('button').should('have.length', 11).first().click();

		getNpsSurveyEmail().find('input').type('test@n8n.io');
		getNpsSurveyEmail().find('button').click();

		cy.log('🛑 Visiting next day — survey should not appear');
		workflowPage.actions.visit(true, NOW + ONE_DAY);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('not.be.visible');

		cy.log('📆 Visiting 6 months later — survey should appear again');
		workflowPage.actions.visit(true, NOW + SIX_MONTHS);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('be.visible');
	});

	it('⏳ Allows to skip NPS 3 times before 6-month suppression', () => {
		const visitAndCloseSurvey = (offset: number, index: number) => {
			cy.log(`🕒 Visit #${index + 1} at T+${offset / ONE_DAY}d`);
			workflowPage.actions.visit(true, offset);
			workflowPage.actions.saveWorkflowOnButtonClick();
			clearNotifications();
			getNpsSurvey().should('be.visible');
			getNpsSurveyClose().click();
			getNpsSurvey().should('not.be.visible');
		};

		visitAndCloseSurvey(NOW, 0);
		workflowPage.actions.visit(true, NOW + ONE_DAY);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('not.be.visible');

		visitAndCloseSurvey(NOW + SEVEN_DAYS + 10000, 1);
		workflowPage.actions.visit(true, NOW + SEVEN_DAYS + 20000);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('not.be.visible');

		visitAndCloseSurvey(NOW + (SEVEN_DAYS + 10000) * 2 + ONE_DAY, 2);
		workflowPage.actions.visit(true, NOW + (SEVEN_DAYS + 10000) * 2 + ONE_DAY * 2);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('not.be.visible');

		cy.log('🚫 NPS still hidden a week later');
		workflowPage.actions.visit(true, NOW + (SEVEN_DAYS + 10000) * 3 + ONE_DAY * 3);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('not.be.visible');

		cy.log('📆 Survey reappears after 6 months');
		workflowPage.actions.visit(true, NOW + (SEVEN_DAYS + 10000) * 3 + SIX_MONTHS);
		workflowPage.actions.saveWorkflowOnButtonClick();
		getNpsSurvey().should('be.visible');
	});
});
