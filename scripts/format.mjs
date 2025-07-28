#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

// === Константы ===
const prettier = path.resolve('node_modules', '.bin', 'prettier');
const biome = path.resolve('node_modules', '.bin', 'biome');
const prettierConfig = path.resolve('.prettierrc.js');
const biomeConfig = path.resolve('biome.jsonc');
const ignoreFile = path.resolve('.prettierignore');

const ROOT_DIRS_TO_SKIP = ['.git', 'node_modules', 'packages', '.turbo', 'cypress'];
const EXTENSIONS_PRETTIER = ['.yml'];
const EXTENSIONS_BIOME = ['.js', '.json', '.ts'];

// === Проверка зависимостей ===
[prettier, biome].forEach((bin) => {
	if (!fs.existsSync(bin)) {
		console.error(`❌ ${path.basename(bin)} not found at: ${bin}`);
		console.error('👉 Please run `pnpm install` first.');
		process.exit(1);
	}
});

// === Утилиты ===
const isDir = (p) => fs.existsSync(p) && fs.lstatSync(p).isDirectory();
const isFile = (p) => fs.existsSync(p) && fs.lstatSync(p).isFile();
const hasExt = (file, exts) => exts.some((ext) => file.endsWith(ext));

// === Сбор файлов ===
const prettierTargets = [];
const biomeTargets = [];

const walk = (dir) => {
	for (const entry of fs.readdirSync(dir)) {
		const entryPath = path.resolve(dir, entry);
		if (ROOT_DIRS_TO_SKIP.includes(entry)) continue;
		if (isDir(entryPath)) {
			walk(entryPath);
		} else if (isFile(entryPath)) {
			if (hasExt(entryPath, EXTENSIONS_PRETTIER)) prettierTargets.push(entryPath);
			if (hasExt(entryPath, EXTENSIONS_BIOME)) biomeTargets.push(entryPath);
		}
	}
};

// Начальная директория
walk('.');

// === Форматирование Prettier ===
if (prettierTargets.length > 0) {
	console.log(`✨ Formatting with Prettier (${prettierTargets.length} files)...`);
	const result = spawnSync(prettier, [
		'--config', prettierConfig,
		'--ignore-path', ignoreFile,
		'--write',
		...prettierTargets,
	], { stdio: 'inherit', shell: true });

	if (result.status !== 0) {
		console.error('❌ Prettier formatting failed');
		process.exit(result.status);
	}
}

// === Форматирование Biome ===
if (biomeTargets.length > 0) {
	console.log(`🧪 Formatting with Biome (${biomeTargets.length} files)...`);
	const result = spawnSync(biome, [
		'format',
		'--write',
		`--config-path=${biomeConfig}`,
		...biomeTargets,
	], { stdio: 'inherit', shell: true });

	if (result.status !== 0) {
		console.error('❌ Biome formatting failed');
		process.exit(result.status);
	}
}

console.log('✅ Formatting complete.');
