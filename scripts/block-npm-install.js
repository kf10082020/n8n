// scripts/block-npm-install.js

// Получаем строку user agent от npm/pnpm/yarn
const { npm_config_user_agent: UA } = process.env;

// Попытка определить менеджер пакетов
const [packageManager = ''] = (UA ?? '').split(' ');
const [name = '', version = ''] = packageManager.split('/');

// Цвета ANSI
const RED = '\x1b[31m';
const GREEN_BOLD = '\x1b[1;92m';
const RESET = '\x1b[0m';

// Только pnpm разрешён
if (name !== 'pnpm') {
	const suggestion = `${GREEN_BOLD}pnpm${RED}`;
	console.error(RED);
	console.error('╭────────────────────────────────────────────╮');
	console.error(`│  Please use ${suggestion} instead of ${name || 'unknown'}       │`);
	console.error('╰────────────────────────────────────────────╯');
	console.error(RESET);
	process.exit(1);
}
