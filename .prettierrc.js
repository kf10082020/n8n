/** @see https://prettier.io/docs/en/options.html */
module.exports = {
	// Завершать строки точкой с запятой
	semi: true,

	// Добавлять запятые в последнем элементе (массивы, объекты, импорты)
	trailingComma: 'all',

	// Пробелы между скобками в объектах: { foo: bar }
	bracketSpacing: true,

	// Использовать табуляцию вместо пробелов
	useTabs: true,

	// Ширина таба (визуальная)
	tabWidth: 2,

	// Всегда оборачивать аргументы стрелочных функций в скобки
	arrowParens: 'always',

	// Использовать одинарные кавычки вместо двойных
	singleQuote: true,

	// Кавычки у ключей только если необходимо: { key: 'value', 'invalid-key': 'value' }
	quoteProps: 'as-needed',

	// Символ конца строки — LF
	endOfLine: 'lf',

	// Максимальная длина строки
	printWidth: 100,
};
