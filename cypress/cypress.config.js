const { defineConfig } = require('cypress');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5678';

module.exports = defineConfig({
	// 📦 Уникальный ID проекта для Cypress Dashboard (если используется)
	projectId: '5hbsdn',

	// 🔁 Поведение при повторных попытках
	retries: {
		openMode: 0, // локально — не повторять
		runMode: 2,  // в CI — 2 попытки
	},

	// ⏱️ Глобальные таймауты
	defaultCommandTimeout: 10000,  // по умолчанию для команд
	requestTimeout: 12000,         // таймаут для XHR/Fetch
	numTestsKeptInMemory: 2,       // для экономии памяти

	// ⚙️ Экспериментальные флаги (можно отключить при нестабильности)
	experimentalMemoryManagement: true,
	e2e: {
		baseUrl: BASE_URL,

		// 🖥️ Настройки экрана
		viewportWidth: 1536,
		viewportHeight: 960,

		// 🎥 Видео / скриншоты
		video: true,
		screenshotOnRunFailure: true,

		// ⚙️ Эксперименты Cypress
		experimentalInteractiveRunEvents: true,
		experimentalSessionAndOrigin: true,

		// 📁 Путь к тестам и поддержке
		specPattern: 'e2e/**/*.ts',
		supportFile: 'support/e2e.ts',
		fixturesFolder: 'fixtures',
		downloadsFolder: 'downloads',
		screenshotsFolder: 'screenshots',
		videosFolder: 'videos',

		// 🔌 Подключение плагинов
		setupNodeEvents(on, config) {
			// 🎯 Фильтрация тестов с помощью @cypress/grep
			require('@cypress/grep/src/plugin')(config);

			// Возможность подключить другие плагины:
			// require('cypress-mochawesome-reporter/plugin')(on);
			// require('./custom-logger-plugin')(on, config);

			return config;
		},
	},
});
