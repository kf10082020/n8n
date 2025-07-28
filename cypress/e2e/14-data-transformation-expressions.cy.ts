import { WorkflowPage, NDV } from '../pages';

const wf = new WorkflowPage();
const ndv = new NDV();

describe('Data transformation expressions', () => {
	beforeEach(() => {
		wf.actions.visit();
	});

	const runExpressionTest = (label: string, pinnedData: object[], input: string, expected: string) => {
		it(label, () => {
			wf.actions.addInitialNodeToCanvas('Schedule Trigger', { keepNdvOpen: true });
			ndv.actions.setPinnedData(pinnedData);
			ndv.actions.close();
			addEditFields();

			ndv.getters.inlineExpressionEditorInput().clear().type(input);
			ndv.getters.inlineExpressionEditorOutput().should('have.text', expected);

			ndv.actions.execute();
			ndv.getters.outputDataContainer().should('be.visible');
			ndv.getters.outputDataContainer().contains(expected);
		});
	};

	runExpressionTest(
		'$json + native string methods',
		[{ myStr: 'Monday' }],
		'{{$json.myStr.toLowerCase() + " is " + "today".toUpperCase()}}',
		'monday is TODAY'
	);

	runExpressionTest(
		'$json + n8n string methods',
		[{ myStr: 'hello@n8n.io is an email' }],
		'{{$json.myStr.extractEmail() + " " + $json.myStr.isEmpty()}}',
		'hello@n8n.io false'
	);

	runExpressionTest(
		'$json + native numeric methods',
		[{ myNum: 9.123 }],
		'{{$json.myNum.toPrecision(3)}}',
		'9.12'
	);

	runExpressionTest(
		'$json + n8n numeric methods (again)',
		[{ myStr: 'hello@n8n.io is an email' }],
		'{{$json.myStr.extractEmail() + " " + $json.myStr.isEmpty()}}',
		'hello@n8n.io false'
	);

	runExpressionTest(
		'$json + native array access',
		[{ myArr: [1, 2, 3] }],
		'{{$json.myArr.includes(1) + " " + $json.myArr[2]}}',
		'true 3'
	);

	runExpressionTest(
		'$json + n8n array methods',
		[{ myArr: [1, 2, 3] }],
		'{{$json.myArr.first() + " " + $json.myArr.last()}}',
		'1 3'
	);
});

// ----------------------------------
//             utils
// ----------------------------------

const addEditFields = () => {
	wf.actions.addNodeToCanvas('Edit Fields', true, true);
	ndv.getters.assignmentCollectionAdd('assignments').click();
	ndv.getters.assignmentValue('assignments').contains('Expression').invoke('show').click();
};
