#!/usr/bin/env zx

// ⛔ Resets the repository by deleting all untracked files, except for specific patterns.

import { $, echo, fs, question } from 'zx';
import path from 'path';

$.verbose = true;
process.env.FORCE_COLOR = '1';

const excludePatterns = ['/.vscode/', '/.idea/', '.env'];
const excludeFlags = excludePatterns.map((pattern) => ['-e', pattern]).flat();

// 🟡 Предупреждение
echo('\n⚠️  This will delete all untracked files and directories, including node_modules, build outputs, etc.');
echo(`🛡️  Excluding: ${excludePatterns.map((x) => `"${x}"`).join(', ')}`);
echo();

const answer = await question('❓ Do you want to continue? (y/n) ');

if (!['y', 'Y', ''].includes(answer.trim())) {
	echo('❌ Aborted by user.');
	process.exit(0);
}

// 🧹 Очистка
echo('\n🧹 Cleaning untracked files...');
try {
	await $({ verbose: true })`git clean -fxd ${excludeFlags}`;
} catch (error) {
	console.error('❌ Failed to run git clean:', error.message);
	process.exit(1);
}

// 🗑️ Удаляем node_modules, если git не справился
const nodeModulesPath = path.resolve('node_modules');
if (fs.existsSync(nodeModulesPath)) {
	echo('🗑️  Removing node_modules...');
	fs.removeSync(nodeModulesPath);
}

// ⬇️ Установка зависимостей
echo('\n⏬ Installing dependencies...');
await $`pnpm install`;

// 🏗️ Сборка проекта
echo('\n🏗️ Building the project...');
await $`pnpm build`;

echo('\n✅ Reset complete.\n');
