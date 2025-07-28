/**
 * Страница демо-воркфлоу.
 * Содержит действия для перехода и загрузки воркфлоу через postMessage.
 */

type Theme = 'dark' | 'light';

/**
 * Переход на страницу демо-воркфлоу с опциональной темой.
 *
 * @param theme - Тема интерфейса: 'dark' или 'light'
 *
 * @example
 * visitDemoPage(); // по умолчанию
 * visitDemoPage('dark');
 */
export function visitDemoPage(theme?: Theme): void {
	const query = theme ? `?theme=${theme}` : '';
	cy.visit('/workflows/demo' + query);

	cy.waitForLoad();

	cy.window().then((win) => {
		// Предотвращает переход на другое окно до завершения загрузки
		win.preventNodeViewBeforeUnload = true;
	});
}

/**
 * Импортирует воркфлоу на демо-страницу через postMessage.
 *
 * @param workflow - JSON-объект воркфлоу, совместимый с n8n
 *
 * @example
 * importWorkflow({ name: 'Test', nodes: [], connections: {} });
 */
export function importWorkflow(workflow: Record<string, any>): void {
	const OPEN_WORKFLOW = { command: 'openWorkflow', workflow };

	cy.window().then((win) => {
		const message = JSON.stringify(OPEN_WORKFLOW);
		win.postMessage(message, '*');
	});
}
