import 'cypress-real-events';
import type { FrontendSettings } from '@n8n/api-types';
import FakeTimers from '@sinonjs/fake-timers';

import {
	BACKEND_BASE_URL,
	INSTANCE_ADMIN,
	INSTANCE_MEMBERS,
	INSTANCE_OWNER,
	N8N_AUTH_COOKIE,
} from '../constants';
import { WorkflowPage } from '../pages';
import { getUniqueWorkflowName } from '../utils/workflowUtils';

Cypress.Commands.add('setAppDate', (targetDate: number | Date) => {
	cy.window().then((win) => {
		FakeTimers.withGlobal(win).install({
			now: targetDate,
			toFake: ['Date'],
			shouldAdvanceTime: true,
		});
	});
});

Cypress.Commands.add('getByTestId', (selector, ...args) =>
	cy.get(`[data-test-id="${selector}"]`, ...args),
);

Cypress.Commands.add(
	'createFixtureWorkflow',
	(fixtureKey: string, workflowName = getUniqueWorkflowName()) => {
		const workflowPage = new WorkflowPage();
		workflowPage.getters.workflowImportInput().selectFile(`fixtures/${fixtureKey}`, { force: true });
		cy.waitForLoad(false);
		workflowPage.actions.setWorkflowName(workflowName);
		workflowPage.getters.saveButton().should('contain', 'Saved');
		workflowPage.actions.zoomToFit();
	},
);

Cypress.Commands.addQuery('findChildByTestId', (testId: string) => {
	return (subject: JQuery<HTMLElement>) => subject.find(`[data-test-id="${testId}"]`);
});

Cypress.Commands.add('waitForLoad', (waitForIntercepts = true) => {
	if (waitForIntercepts) cy.wait(['@loadSettings', '@loadNodeTypes']);
	cy.getByTestId('node-view-loader', { timeout: 20000 }).should('not.exist');
	cy.get('.el-loading-mask', { timeout: 20000 }).should('not.exist');
});

Cypress.Commands.add('signin', ({ email, password }) => {
	void Cypress.session.clearAllSavedSessions();
	cy.session([email, password], () => {
		cy.request({
			method: 'POST',
			url: `${BACKEND_BASE_URL}/rest/login`,
			body: { emailOrLdapLoginId: email, password },
			failOnStatusCode: false,
		}).then((response) => {
			Cypress.env('currentUserId', response.body.data.id);
		});
	});
});

Cypress.Commands.add('signinAsOwner', () => cy.signin(INSTANCE_OWNER));
Cypress.Commands.add('signinAsAdmin', () => cy.signin(INSTANCE_ADMIN));
Cypress.Commands.add('signinAsMember', (index = 0) => cy.signin(INSTANCE_MEMBERS[index]));

Cypress.Commands.add('signout', () => {
	cy.request({
		method: 'POST',
		url: `${BACKEND_BASE_URL}/rest/logout`,
		headers: { 'browser-id': localStorage.getItem('n8n-browserId') },
	});
	cy.getCookie(N8N_AUTH_COOKIE).should('not.exist');
});

export let settings: Partial<FrontendSettings>;
Cypress.Commands.add('overrideSettings', (value: Partial<FrontendSettings>) => {
	settings = value;
});

const setFeature = (feature: string, enabled: boolean) =>
	cy.request('PATCH', `${BACKEND_BASE_URL}/rest/e2e/feature`, {
		feature: `feat:${feature}`,
		enabled,
	});

const setQuota = (feature: string, value: number) =>
	cy.request('PATCH', `${BACKEND_BASE_URL}/rest/e2e/quota`, {
		feature: `quota:${feature}`,
		value,
	});

const setQueueMode = (enabled: boolean) =>
	cy.request('PATCH', `${BACKEND_BASE_URL}/rest/e2e/queue-mode`, { enabled });

Cypress.Commands.add('enableFeature', (feature: string) => setFeature(feature, true));
Cypress.Commands.add('disableFeature', (feature: string) => setFeature(feature, false));
Cypress.Commands.add('changeQuota', (feature: string, value: number) => setQuota(feature, value));
Cypress.Commands.add('enableQueueMode', () => setQueueMode(true));
Cypress.Commands.add('disableQueueMode', () => setQueueMode(false));

Cypress.Commands.add('grantBrowserPermissions', (...permissions: string[]) => {
	if (Cypress.isBrowser('chrome')) {
		cy.wrap(
			Cypress.automation('remote:debugger:protocol', {
				command: 'Browser.grantPermissions',
				params: {
					permissions,
					origin: window.location.origin,
				},
			}),
		);
	}
});

Cypress.Commands.add('readClipboard', () =>
	cy.window().then((win) => win.navigator.clipboard.readText()),
);

Cypress.Commands.add('paste', { prevSubject: true }, (selector, pastePayload: string) => {
	cy.wrap(selector).then(($el) => {
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
		Object.assign(pasteEvent, {
			clipboardData: {
				getData: () => pastePayload,
			},
		});
		$el[0].dispatchEvent(pasteEvent);
	});
});

Cypress.Commands.add('drag', (selector, pos, options = {}) => {
	const index = options.index ?? 0;
	const [xDiff, yDiff] = pos;
	const getElement = () => (typeof selector === 'string' ? cy.get(selector).eq(index) : selector);

	getElement().should('exist').then(([$el]) => {
		const rect = $el.getBoundingClientRect();
		const x = options.abs ? xDiff : rect.right + xDiff;
		const y = options.abs ? yDiff : rect.top + yDiff;

		if (options.realMouse) {
			getElement().realMouseDown().realMouseMove(0, 0).realMouseMove(x, y).realMouseUp();
		} else {
			getElement()
				.trigger('mousedown', { force: true })
				.trigger('mousemove', { which: 1, pageX: x, pageY: y, force: true });

			if (options.moveTwice) {
				getElement().trigger('mousemove', { which: 1, pageX: x, pageY: y, force: true });
			}
			if (options.clickToFinish) {
				cy.get('body').click(x, y);
			} else {
				getElement().trigger('mouseup', { force: true });
			}
		}
	});
});

Cypress.Commands.add('draganddrop', (draggableSelector, droppableSelector, options = {}) => {
	if (draggableSelector) cy.get(draggableSelector).should('exist');
	cy.get(droppableSelector).should('exist');

	cy.get(droppableSelector).first().then(([$el]) => {
		const rect = $el.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;

		if (draggableSelector) cy.get(draggableSelector).realMouseDown();
		cy.get(droppableSelector)
			.realMouseMove(0, 0)
			.realMouseMove(x, y)
			.realHover()
			.realMouseUp({ position: options.position ?? 'top' });
		if (draggableSelector) cy.get(draggableSelector).realMouseUp();
	});
});

Cypress.Commands.add('push', (type: string, data: unknown) => {
	cy.request('POST', `${BACKEND_BASE_URL}/rest/e2e/push`, { type, data });
});

Cypress.Commands.add('shouldNotHaveConsoleErrors', () => {
	cy.window().then((win) => {
		const spy = cy.spy(win.console, 'error');
		cy.wrap(spy).should('not.have.been.called');
	});
});

Cypress.Commands.add('resetDatabase', () => {
	cy.request('POST', `${BACKEND_BASE_URL}/rest/e2e/reset`, {
		owner: INSTANCE_OWNER,
		members: INSTANCE_MEMBERS,
		admin: INSTANCE_ADMIN,
	});
});

Cypress.Commands.add('interceptNewTab', () => {
	cy.window().then((win) => {
		cy.stub(win, 'open').as('windowOpen');
	});
});

Cypress.Commands.add('visitInterceptedTab', () => {
	cy.get('@windowOpen')
		.should('have.been.called')
		.then((stub: any) => {
			const url = stub.firstCall.args[0];
			cy.visit(url);
		});
});
