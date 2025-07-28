import { getCredentialSaveButton } from '../composables/modals/credential-modal';
import { CredentialsPage, CredentialsModal } from '../pages';

const credentialsPage = new CredentialsPage();
const credentialsModal = new CredentialsModal();

const CLIENT_ID = 'test-key';
const CLIENT_SECRET = 'test-secret';
const REDIRECT_URI = encodeURIComponent('http://localhost:5678/rest/oauth2-credential/callback');

describe('🔐 Google OAuth2 Flow', () => {
	beforeEach(() => {
		cy.log('🌐 Visiting credentials page and stubbing window.open');

		cy.visit(credentialsPage.url, {
			onBeforeLoad(win) {
				cy.stub(win, 'open').as('windowOpen');
			},
		});
	});

	it('should create and connect with Google OAuth2 successfully', () => {
		cy.log('➕ Creating new Google OAuth2 credential');

		credentialsPage.getters.emptyListCreateCredentialButton().click();
		credentialsModal.getters.newCredentialTypeOption('Google OAuth2 API').click();
		credentialsModal.getters.newCredentialTypeButton().click();

		cy.log('✍️ Filling Client ID & Secret');
		credentialsModal.actions.fillField('clientId', CLIENT_ID);
		credentialsModal.actions.fillField('clientSecret', CLIENT_SECRET);
		credentialsModal.actions.save();

		cy.log('🔗 Initiating OAuth connection');
		credentialsModal.getters.oauthConnectButton().click();

		const expectedOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

		cy.get('@windowOpen').should(
			'have.been.calledOnceWith',
			Cypress.sinon.match(expectedOAuthUrl),
			'OAuth Authorization',
			'scrollbars=no,resizable=yes,status=no,titlebar=noe,location=no,toolbar=no,menubar=no,width=500,height=700',
		);

		cy.log('✅ Simulating successful OAuth response via BroadcastChannel');
		cy.window().then(() => {
			const channel = new BroadcastChannel('oauth-callback');
			channel.postMessage('success');
		});

		cy.log('📦 Verifying credential saved state and banner');
		getCredentialSaveButton().should('contain.text', 'Saved');
		credentialsModal.getters.oauthConnectSuccessBanner().should('be.visible');

		// Optional visual regression snapshot
		// cy.percySnapshot?.('OAuth2 Credential Connected');
	});
});
