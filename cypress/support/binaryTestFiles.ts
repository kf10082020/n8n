import { stringify } from 'flatted';
import pick from 'lodash/pick';
import type {
	IDataObject,
	IRunData,
	IRunExecutionData,
	ITaskData,
	ITaskDataConnections,
} from 'n8n-workflow';
import { nanoid } from 'nanoid';

import { clickExecuteWorkflowButton } from '../composables/workflow';

/**
 * Генерирует моковые данные выполнения одного узла
 *
 * @param name - Название узла
 * @param config - Конфигурация выполнения узла и данные
 * @returns Мапа с результатом выполнения по имени узла
 */
export function createMockNodeExecutionData(
	name: string,
	{
		data,
		inputOverride,
		executionStatus = 'success',
		jsonData,
		...rest
	}: Partial<ITaskData> & { jsonData?: Record<string, IDataObject> },
): Record<string, ITaskData> {
	const resolvedData = jsonData
		? Object.fromEntries(
				Object.entries(jsonData).map(([key, value]) => [
					key,
					[
						[
							{
								json: value,
								pairedItem: { item: 0 },
							},
						],
					],
				]),
			)
		: data;

	return {
		[name]: {
			startTime: Date.now(),
			executionIndex: 0,
			executionTime: 1,
			executionStatus,
			data: resolvedData,
			source: [null],
			inputOverride,
			...rest,
		},
	};
}

/**
 * Имитация выполнения workflow с мок-данными и Cypress-интеграцией
 *
 * @param config - Конфигурация исполнения workflow
 * @property trigger - Колбэк, инициирующий выполнение (например, нажатие на UI)
 * @property lastNodeExecuted - Название последнего узла
 * @property runData - Набор моков для узлов
 */
export function runMockWorkflowExecution({
	trigger,
	lastNodeExecuted,
	runData,
}: {
	trigger?: () => void;
	lastNodeExecuted: string;
	runData: Array<ReturnType<typeof createMockNodeExecutionData>>;
}) {
	const workflowId = nanoid();
	const executionId = Math.floor(Math.random() * 1_000_000).toString();

	const resolvedRunData = runData.reduce<IRunData>((acc, nodeExecution) => {
		const nodeName = Object.keys(nodeExecution)[0];
		acc[nodeName] = [nodeExecution[nodeName]];
		return acc;
	}, {});

	const executionData: IRunExecutionData = {
		startData: {},
		resultData: {
			runData: resolvedRunData,
			pinData: {},
			lastNodeExecuted,
		},
		executionData: {
			contextData: {},
			nodeExecutionStack: [],
			metadata: {},
			waitingExecution: {},
			waitingExecutionSource: {},
		},
	};

	// Мокаем запрос запуска workflow
	cy.intercept('POST', '/rest/workflows/**/run?**', {
		statusCode: 201,
		body: {
			data: {
				executionId,
			},
		},
	}).as('runWorkflow');

	// Триггер запуска
	trigger ? trigger() : clickExecuteWorkflowButton();

	cy.wait('@runWorkflow');

	// Эмуляция сообщений от backend
	cy.push('executionStarted', {
		workflowId,
		executionId,
		mode: 'manual',
		startedAt: new Date(),
		workflowName: '',
		flattedRunData: '',
	});

	runData.forEach((nodeExecution) => {
		const nodeName = Object.keys(nodeExecution)[0];
		const nodeRunData = nodeExecution[nodeName];

		cy.push('nodeExecuteBefore', {
			executionId,
			nodeName,
			data: pick(nodeRunData, ['startTime', 'executionIndex', 'source', 'hints']),
		});
		cy.push('nodeExecuteAfter', {
			executionId,
			nodeName,
			data: nodeRunData,
		});
	});

	cy.push('executionFinished', {
		executionId,
		workflowId,
		status: 'success',
		rawData: stringify(executionData),
	});
}
