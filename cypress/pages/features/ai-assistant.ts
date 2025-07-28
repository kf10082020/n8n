/**
 * AI Assistant - Functional Cypress Composables
 *
 * Переработано из class-based подхода. Использовать только функции.
 * Поддерживает feature-флаг, сообщения, кнопки, чат, быстрые ответы и кодовые диффы.
 */

/// <reference types="cypress" />

// === Getters ===

export const getAskAssistantFloatingButton = () => cy.getByTestId('ask-assistant-floating-button');
export const getAskAssistantSidebar = () => cy.getByTestId('ask-assistant-sidebar');
export const getAskAssistantSidebarResizer = () =>
	getAskAssistantSidebar().find('[class^=_resizer][data-dir=left]').first();

export const getAskAssistantChat = () => cy.getByTestId('ask-assistant-chat');
export const getPlaceholderMessage = () => cy.getByTestId('placeholder-message');
export const getCloseChatButton = () => cy.getByTestId('close-chat-button');
export const getChatInputWrapper = () => cy.getByTestId('chat-input-wrapper');
export const getChatInput = () => cy.getByTestId('chat-input');
export const getSendMessageButton = () => cy.getByTestId('send-message-button');

export const getAllChatMessages = () => cy.get('[data-test-id^=chat-message]');
export const getAssistantMessages = () => cy.getByTestId('chat-message-assistant');
export const getUserMessages = () => cy.getByTestId('chat-message-user');
export const getSystemMessages = () => cy.getByTestId('chat-message-system');

export const getQuickReplies = () => cy.getByTestId('quick-replies');
export const getQuickReplyButtons = () => getQuickReplies().find('button');

export const getNewSessionModal = () => cy.getByTestId('new-assistant-session-modal');
export const getCodeDiffs = () => cy.getByTestId('code-diff-suggestion');
export const getApplyCodeDiffButtons = () => cy.getByTestId('replace-code-button');
export const getUndoReplaceCodeButtons = () => cy.getByTestId('undo-replace-button');
export const getCodeReplacedMessage = () => cy.getByTestId('code-replaced-message');

export const getNodeErrorAssistantButton = () =>
	cy.getByTestId('node-error-view-ask-assistant-button').find('button').first();

export const getCredentialEditAssistantButton = () => cy.getByTestId('credential-edit-ask-assistant-button');
export const getCodeSnippet = () => cy.getByTestId('assistant-code-snippet-content');

// === Actions ===

export const enableAIAssistant = () => cy.enableFeature('aiAssistant');
export const disableAIAssistant = () => cy.disableFeature('aiAssistant');

export const openChat = () => {
	getAskAssistantFloatingButton().click();
	getAskAssistantChat().should('be.visible');
};

export const closeChat = () => {
	getCloseChatButton().click();
	getAskAssistantChat().should('not.be.visible');
};

export const sendMessage = (message: string) => {
	getChatInput().type(message).type('{enter}');
};
