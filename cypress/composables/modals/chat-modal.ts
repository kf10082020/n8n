/**
 * ===========================
 * Chat Modal – Cypress Helpers
 * ===========================
 * Содержит геттеры и действия для работы с модальным окном чата вручную.
 */

/**
 * Getters
 */

export function getManualChatModal() {
	return cy.getByTestId('canvas-chat');
}

export function getManualChatInput() {
	return getManualChatModal().find('.chat-inputs textarea');
}

export function getManualChatSendButton() {
	return getManualChatModal().find('.chat-input-send-button');
}

export function getManualChatMessages() {
	return getManualChatModal().find('.chat-messages-list .chat-message');
}

export function getManualChatModalCloseButton() {
	return cy.getByTestId('workflow-chat-button');
}

export function getManualChatDialog() {
	return getManualChatModal().getByTestId('workflow-lm-chat-dialog');
}

/**
 * Actions
 */

export function sendManualChatMessage(message: string) {
	getManualChatInput()
		.should('be.visible') // гарантия появления
		.type(message, { delay: 10 }); // симуляция живого ввода
	getManualChatSendButton().click();
}

export function closeManualChatModal() {
	getManualChatModalCloseButton().click();
}
