import registerCypressGrep from '@cypress/grep/src/support';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import { settings } from './commands';

registerCypressGrep();

/**
 * Глобальные хуки — выполняются один раз перед всеми тестами
 */
before(() => {
	cy.resetDatabase();

	// Игнорируем ошибку ResizeObserver (часто бывает в Chrome при отсутствии фокуса)
	Cypress.on('uncaught:exception', (error) => {
		return !error.message.includes('ResizeObserver');
	});

	// Мокаем clipboard API (устранение флаки в CI и без фокуса окна)
	Cypress.on('window:before:load', (win) => {
		let currentContent = '';
		Object.assign(win.navigator.clipboard, {
			writeText: async (text: string) => {
				currentContent = text;
				return Promise.resolve();
			},
			readText: async () => Promise.resolve(currentContent),
		});
	});
});

/**
 * Выполняется перед каждым тестом
 */
beforeEach(() => {
	// Автоматический логин, если не отключён флагом
	if (!cy.config('disableAutoLogin')) {
		cy.signinAsOwner();
	}

	// Устанавливаем параметры локального хранилища
	cy.window().then((win) => {
		win.localStorage.setItem('N8N_THEME', 'light');
		win.localStorage.setItem('N8N_AUTOCOMPLETE_ONBOARDED', 'true');
		win.localStorage.setItem('N8N_MAPPING_ONBOARDED', 'true');
	});

	// Настройки приложения с наложением поверх дефолта
	cy.intercept('GET', '/rest/settings', (req) => {
		delete req.headers['if-none-match']; // отключаем кэш
		req.on('response', (res) => {
			const mergedSettings = merge(cloneDeep(res.body.data), settings);
			res.send({ data: mergedSettings });
		});
	}).as('loadSettings');

	// Интерцепт nodeTypes
	cy.intercept('GET', '/types/nodes.json').as('loadNodeTypes');

	// Успешный тест подключения credentials
	cy.intercept('POST', '/rest/credentials/test', {
		data: { status: 'success', message: 'Tested successfully' },
	}).as('credentialTest');

	// Лицензия (мокаем renew)
	cy.intercept('POST', '/rest/license/renew', {
		data: {
			usage: {
				activeWorkflowTriggers: {
					limit: -1,
					value: 0,
					warningThreshold: 0.8,
				},
			},
			license: {
				planId: '',
				planName: 'Community',
			},
		},
	});

	// Healthcheck
	cy.intercept({ pathname: '/api/health' }, { status: 'OK' }).as('healthCheck');

	// Версии системы
	cy.intercept({ pathname: '/api/versions/*' }, [
		{
			name: '1.45.1',
			createdAt: '2023-08-18T11:53:12.857Z',
			hasSecurityIssue: null,
			hasSecurityFix: null,
			securityIssueFixVersion: null,
			hasBreakingChange: null,
			documentationUrl: 'https://docs.n8n.io/release-notes/#n8n131',
			nodes: [],
			description: 'Includes <strong>bug fixes</strong>',
		},
		{
			name: '1.0.5',
			createdAt: '2023-07-24T10:54:56.097Z',
			hasSecurityIssue: false,
			hasSecurityFix: null,
			securityIssueFixVersion: null,
			hasBreakingChange: true,
			documentationUrl: 'https://docs.n8n.io/release-notes/#n8n104',
			nodes: [],
			description: 'Includes <strong>core functionality</strong> and <strong>bug fixes</strong>',
		},
	]).as('getVersions');
});
