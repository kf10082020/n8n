/**
 * Composables for interacting with the Setup Template Form Step.
 * These helpers are used to locate and operate on elements within the setup credentials flow.
 */

/// <reference types="cypress" />

/**
 * Returns the main container element of the credentials form step.
 */
export const getFormStep = () => cy.getByTestId('setup-credentials-form-step');

/**
 * Returns the heading element within the credentials form step.
 * @param parentEl - Parent element from which to find the heading
 */
export const getStepHeading = (parentEl: JQuery<HTMLElement>) =>
	cy.wrap(parentEl).findChildByTestId('credential-step-heading');

/**
 * Returns the description element within the credentials form step.
 * @param parentEl - Parent element from which to find the description
 */
export const getStepDescription = (parentEl: JQuery<HTMLElement>) =>
	cy.wrap(parentEl).findChildByTestId('credential-step-description');

/**
 * Returns the button for creating a new credential for a specific app.
 * @param appName - The name of the app used in the button text
 */
export const getCreateAppCredentialsButton = (appName: string) =>
	cy.contains('button', `Create new ${appName} credential`);
