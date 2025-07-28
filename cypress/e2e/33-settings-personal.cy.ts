import { errorToast, successToast } from '../pages/notifications';

const INVALID_NAMES = [
	'https://n8n.io',
	'http://n8n.io',
	'www.n8n.io',
	'n8n.io',
	'n8n.бг',
	'n8n.io/home',
	'n8n.io/home?send=true',
	'<a href="#">Jack</a>',
	'<script>alert("Hello")</script>',
];

const VALID_NAMES: [string, string][] = [
	['a', 'a'],
	['alice', 'alice'],
	['Robert', 'Downey Jr.'],
	['Mia', 'Mia-Downey'],
	['Mark', "O'neil"],
	['Thomas', 'Müler'],
	['ßáçøñ', 'ßáçøñ'],
	['أحمد', 'فلسطين'],
	['Милорад', 'Филиповић'],
];

describe('👤 Personal Settings', () => {
	beforeEach(() => {
		cy.visit('/settings/personal');
	});

	it('should allow valid names to be saved successfully', () => {
		VALID_NAMES.forEach(([firstName, lastName]) => {
			cy.log(`✏️ Typing: ${firstName} ${lastName}`);
			cy.getByTestId('personal-data-form').within(() => {
				cy.get('input[name="firstName"]').clear().type(firstName);
				cy.get('input[name="lastName"]').clear().type(lastName);
			});

			cy.getByTestId('save-settings-button').click();

			successToast().should('contain.text', 'Personal details updated');
			successToast().find('.el-notification__closeBtn').click();
		});
	});

	it('should reject malicious values and show an error toast', () => {
		INVALID_NAMES.forEach((value) => {
			cy.log(`🛑 Trying invalid input: ${value}`);
			cy.getByTestId('personal-data-form').within(() => {
				cy.get('input[name="firstName"]').clear().type(value);
				cy.get('input[name="lastName"]').clear().type(value);
			});

			cy.getByTestId('save-settings-button').click();

			errorToast().should('contain.text', 'Potentially malicious string');
			errorToast().find('.el-notification__closeBtn').click();
		});
	});
});
