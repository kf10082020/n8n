/**
 * Получает все popper-элементы (например, выпадающие списки, тултипы и селекты).
 */
export function getPopper(): Cypress.Chainable<JQuery<HTMLElement>> {
	return cy.get('.el-popper');
}

/**
 * Возвращает только видимые popper-элементы (с aria-hidden="false").
 */
export function getVisiblePopper(): Cypress.Chainable<JQuery<HTMLElement>> {
	return getPopper().filter('[aria-hidden="false"]');
}

/**
 * Возвращает видимый элемент popper-селекта (элемент el-select__popper).
 */
export function getVisibleSelect(): Cypress.Chainable<JQuery<HTMLElement>> {
	return getVisiblePopper().filter('.el-select__popper');
}

/**
 * Возвращает видимый элемент popper-дропдауна (элемент el-dropdown__popper).
 */
export function getVisibleDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
	return getVisiblePopper().filter('.el-dropdown__popper');
}

/**
 * Возвращает видимый tooltip popper (например, всплывающие подсказки).
 */
export function getVisibleTooltip(): Cypress.Chainable<JQuery<HTMLElement>> {
	return getVisiblePopper().filter('.el-tooltip__popper');
}
