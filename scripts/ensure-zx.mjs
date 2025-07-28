// scripts/ensure-zx.mjs

import { accessSync, constants } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const ZX_PATH = resolve('node_modules', '.bin', 'zx');
const INSTALL_CMD = 'pnpm --frozen-lockfile --filter n8n-monorepo install';

// ANSI цвета
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

if (!zxExists()) {
	console.log(`${GREEN}ZX not found. Installing dependencies...${RESET}`);
	try {
		execSync(INSTALL_CMD, { stdio: 'inherit' });
	} catch (error) {
		console.error(`${RED}Failed to install ZX using pnpm.${RESET}`);
		console.error(error.message);
		process.exit(1);
	}
}

function zxExists() {
	try {
		accessSync(ZX_PATH, constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
