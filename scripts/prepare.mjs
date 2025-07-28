#!/usr/bin/env node

import { execSync } from 'node:child_process';

const shouldSkip =
	process.env.CI ||
	process.env.DOCKER_BUILD ||
	process.env.SKIP_HOOKS;

if (shouldSkip) {
	console.log('\x1b[33m[prepare]\x1b[0m Skipping lefthook install (CI, Docker, or SKIP_HOOKS)');
	process.exit(0);
}

console.log('\x1b[36m[prepare]\x1b[0m Installing git hooks via lefthook...');

try {
	execSync('pnpm lefthook install', { stdio: 'inherit' });
	console.log('\x1b[32m[prepare]\x1b[0m lefthook successfully installed.');
} catch (error) {
	console.error('\x1b[31m[prepare]\x1b[0m Failed to install lefthook:');
	console.error(error.message);
	process.exit(1);
}
