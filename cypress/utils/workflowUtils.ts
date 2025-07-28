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
