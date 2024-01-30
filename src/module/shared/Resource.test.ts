import { DEFAULT_QUERY_LIMIT, makeQueryResult } from '@/module/shared/Resource';

describe('QueryResult', () => {
	it('make a query result from a empty list at the start', () => {
		const result = makeQueryResult<number>([], { limit: DEFAULT_QUERY_LIMIT, offset: 0 });

		expect(result).toStrictEqual({
			list: [],
			count: 0,
			limit: DEFAULT_QUERY_LIMIT,
			offset: 0,
			next: null,
			prev: 0,
		});
	});

	it('make a query result from a empty list at the offset 50', () => {
		const offset = 50;

		const result = makeQueryResult<number>([], { limit: DEFAULT_QUERY_LIMIT, offset });

		expect(result).toStrictEqual({
			list: [],
			count: 0,
			limit: DEFAULT_QUERY_LIMIT,
			offset,
			next: null,
			prev: offset - DEFAULT_QUERY_LIMIT,
		});
	});

	it('make a query result from a full list at the start', () => {
		const list = new Array<number>(DEFAULT_QUERY_LIMIT);
		list.fill(0);

		const result = makeQueryResult<number>(list, { limit: DEFAULT_QUERY_LIMIT, offset: 0 });

		expect(result).toStrictEqual({
			list: new Array<number>(DEFAULT_QUERY_LIMIT).fill(0),
			count: DEFAULT_QUERY_LIMIT,
			limit: DEFAULT_QUERY_LIMIT,
			offset: 0,
			next: DEFAULT_QUERY_LIMIT,
			prev: 0,
		});
	});

	it('make a query result from a full list at the offset 50', () => {
		const offset = 50;
		const list = new Array<number>(DEFAULT_QUERY_LIMIT);
		list.fill(0);

		const result = makeQueryResult<number>(list, { limit: DEFAULT_QUERY_LIMIT, offset });

		expect(result).toStrictEqual({
			list: new Array<number>(DEFAULT_QUERY_LIMIT).fill(0),
			count: DEFAULT_QUERY_LIMIT,
			limit: DEFAULT_QUERY_LIMIT,
			offset,
			next: offset + DEFAULT_QUERY_LIMIT,
			prev: offset - DEFAULT_QUERY_LIMIT,
		});
	});
});
