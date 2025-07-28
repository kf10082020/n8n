/// <reference types="cypress" />
/// <reference types="cypress-real-events" />

import type { FrontendSettings, PushPayload, PushType } from '@n8n/api-types';

Cypress.Keyboard.defaults({
	keystrokeDelay: 0,
});

/**
 * Типизация параметров входа в систему
 */
interface SigninPayload {
	email: string;
	password: string;
}

/**
 * Настройки опций drag-and-drop
 */
interface DragAndDropOptions {
	position: 'top' | 'center' | 'bottom';
}

declare global {
	namespace Cypress {
		interface SuiteConfigOverrides {
			disableAutoLogin: boolean;
		}

		interface Chainable {
			// Настройки тестов
			config(key: keyof SuiteConfigOverrides): boolean;

			// Работа с data-testid
			getByTestId(
				selector: string,
				...args: Array<Partial<Loggable & Timeoutable & Withinable & Shadow> | undefined>
			): Chainable<JQuery<HTMLElement>>;

			findChildByTestId(childTestId: string): Chainable<JQuery<HTMLElement>>;

			// Создание workflow по фикстуре
			createFixtureWorkflow(fixtureKey: string, workflowName?: string): Chainable<void>;

			// Аутентификация
			signin(payload: SigninPayload): Chainable<void>; // deprecated
			signinAsOwner(): Chainable<void>;
			signinAsAdmin(): Chainable<void>;
			signinAsMember(index?: number): Chainable<void>;
			signout(): Chainable<void>;

			// Настройки и режимы
			overrideSettings(value: Partial<FrontendSettings>): Chainable<void>;
			enableFeature(feature: string): Chainable<void>;
			disableFeature(feature: string): Chainable<void>;
			enableQueueMode(): Chainable<void>;
			disableQueueMode(): Chainable<void>;
			changeQuota(feature: string, value: number): Chainable<void>;

			// Ожидания
			waitForLoad(waitForIntercepts?: boolean): Chainable<void>;

			// Права и буфер обмена
			grantBrowserPermissions(...permissions: string[]): Chainable<void>;
			readClipboard(): Chainable<string>;
			paste(pastePayload: string): Chainable<void>;

			// Drag and Drop
			drag(
				selector: string | Chainable<JQuery<HTMLElement>>,
				target: [number, number],
				options?: {
					abs?: boolean;
					index?: number;
					realMouse?: boolean;
					clickToFinish?: boolean;
					moveTwice?: boolean;
				}
			): Chainable<void>;

			draganddrop(
				draggableSelector: string,
				droppableSelector: string,
				options?: Partial<DragAndDropOptions>
			): Chainable<void>;

			// Push/Reset
			push<Type extends PushType>(type: Type, data: PushPayload<Type>): Chainable<void>;
			resetDatabase(): Chainable<void>;

			// Проверки
			shouldNotHaveConsoleErrors(): Chainable<void>;

			// Система
			setAppDate(targetDate: number | Date): Chainable<void>;

			// Вкладки
			interceptNewTab(): Chainable<void>;
			visitInterceptedTab(): Chainable<void>;

			// Расширенное окно
			window(): Chainable<
				AUTWindow & {
					innerWidth: number;
					innerHeight: number;
					preventNodeViewBeforeUnload?: boolean;
					maxPinnedDataSize?: number;
					featureFlags: {
						override: (feature: string, value: unknown) => void;
					};
				}
			>;
		}
	}
}

export {};
