/**
 * Feature Flags Composable for Cypress
 * -------------------------------------
 * Provides helper functions for overriding and resetting feature flags
 * during testing sessions.
 */

/// <reference types="cypress" />

type FlagValue = boolean | string;

/**
 * Sets a single feature flag override.
 * @param name - The name of the feature flag
 * @param value - The override value (boolean or string)
 */
export const overrideFeatureFlag = (name: string, value: FlagValue): void => {
	cy.window().then((win) => {
		const existingOverrides = parseOverrides(win.localStorage.getItem('N8N_EXPERIMENT_OVERRIDES'));
		const updatedOverrides = { ...existingOverrides, [name]: value };

		win.localStorage.setItem('N8N_EXPERIMENT_OVERRIDES', JSON.stringify(updatedOverrides));

		if (win.featureFlags?.override) {
			win.featureFlags.override(name, value);
		}
	});
};

/**
 * Sets multiple feature flag overrides at once.
 * @param flags - Record of flag names to their override values
 */
export const overrideFeatureFlags = (flags: Record<string, FlagValue>): void => {
	cy.window().then((win) => {
		const existingOverrides = parseOverrides(win.localStorage.getItem('N8N_EXPERIMENT_OVERRIDES'));
		const updatedOverrides = { ...existingOverrides, ...flags };

		win.localStorage.setItem('N8N_EXPERIMENT_OVERRIDES', JSON.stringify(updatedOverrides));

		if (win.featureFlags?.override) {
			Object.entries(flags).forEach(([name, value]) => {
				win.featureFlags.override(name, value);
			});
		}
	});
};

/**
 * Clears all feature flag overrides (localStorage + runtime if available).
 */
export const resetFeatureFlags = (): void => {
	cy.window().then((win) => {
		win.localStorage.removeItem('N8N_EXPERIMENT_OVERRIDES');

		if (win.featureFlags?.clearOverrides) {
			win.featureFlags.clearOverrides();
		}
	});
};

/**
 * Parses JSON overrides string into object.
 * @param raw - JSON string from localStorage
 */
function parseOverrides(raw: string | null): Record<string, FlagValue> {
	try {
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
