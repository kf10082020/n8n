import { nanoid } from 'nanoid';

/**
 * Генерирует уникальное имя для workflow с опциональным префиксом.
 *
 * @param workflowNamePrefix - (необязательно) префикс перед ID
 * @returns Уникальное имя workflow, пригодное для создания и поиска
 *
 * @example
 * getUniqueWorkflowName();               // "Mv3sBziFUyWq"
 * getUniqueWorkflowName('Test Flow');    // "Test Flow 7aYzxEfpLd42"
 */
export function getUniqueWorkflowName(workflowNamePrefix?: string): string {
	const id = nanoid(12);
	return workflowNamePrefix ? `${workflowNamePrefix} ${id}` : id;
}

/**
 * Создаёт имя workflow с UTC-датой и временем.
 *
 * @param prefix - Префикс перед меткой времени
 * @returns Например: "Test Flow 2025-07-28T18-30-00Z"
 */
export function getTimestampedWorkflowName(prefix = 'Test Flow'): string {
	const iso = new Date().toISOString().replace(/[:.]/g, '-');
	return `${prefix} ${iso}`;
}
