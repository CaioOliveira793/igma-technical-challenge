import { removeStackTrace } from '@/util/error';

describe('removeStackTrace', () => {
	it('remove the stack trace from an error', () => {
		const error = new Error('test');
		const result = removeStackTrace(error);

		expect((result as Error).stack).toStrictEqual(undefined);
		expect(result.message).toStrictEqual('test');
	});
});
