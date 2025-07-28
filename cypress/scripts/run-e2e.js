#!/usr/bin/env node

const { spawn } = require('child_process');
const { mkdirSync, mkdtempSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

// Utility: Create a temporary user folder for isolated testing
function prepareTestEnvironment(customEnv = {}) {
	const baseDir = join(tmpdir(), 'n8n-e2e/');
	mkdirSync(baseDir, { recursive: true });
	const userFolder = mkdtempSync(baseDir);

	process.env.N8N_USER_FOLDER = userFolder;
	process.env.E2E_TESTS = 'true';
	process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

	// Apply custom environment variables
	Object.entries(customEnv).forEach(([key, value]) => {
		process.env[key] = value;
	});
}

// Utility: Run the test command with server start and graceful termination
function runTests({ startCommand, url, testCommand, customEnv = {} }) {
	prepareTestEnvironment(customEnv);

	const fullCommand = `start-server-and-test ${startCommand} ${url} "${testCommand}"`;
	const testProcess = spawn(fullCommand, [], {
		stdio: 'inherit',
		shell: true,
	});

	// Cleanup on termination
	['SIGINT', 'SIGTERM'].forEach(signal => {
		process.on(signal, () => testProcess.kill(signal));
	});

	testProcess.on('exit', (code) => process.exit(code));
}

// Entry: Parse scenario and dispatch
function main() {
	const scenario = process.argv[2];

	switch (scenario) {
		case 'ui':
			runTests({
				startCommand: 'start',
				url: 'http://localhost:5678/favicon.ico',
				testCommand: 'cypress open',
			});
			break;

		case 'dev':
			runTests({
				startCommand: 'develop',
				url: 'http://localhost:8080/favicon.ico',
				testCommand: 'cypress open',
				customEnv: {
					CYPRESS_BASE_URL: 'http://localhost:8080',
				},
			});
			break;

		case 'all': {
			const filter = process.argv[3];
			const specParam = filter ? ` --spec "**/*${filter}*.cy.ts"` : '';

			runTests({
				startCommand: 'start',
				url: 'http://localhost:5678/favicon.ico',
				testCommand: `cypress run --headless${specParam}`,
			});
			break;
		}

		case 'debugFlaky': {
			const grepFilter = process.argv[3];
			const burnCount = process.argv[4] || 5;

			const envArgs = [
				`burn=${burnCount}`,
				...(grepFilter ? [`grep=${grepFilter}`, `grepFilterSpecs=true`] : []),
			];

			const testCommand = `cypress run --headless --env "${envArgs.join(',')}"`;

			console.log(`Executing: ${testCommand}`);
			runTests({
				startCommand: 'start',
				url: 'http://localhost:5678/favicon.ico',
				testCommand,
			});
			break;
		}

		default:
			console.error('❌ Unknown scenario. Use one of: ui | dev | all [filter] | debugFlaky [grep] [burn]');
			process.exit(1);
	}
}

main();
