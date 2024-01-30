import { DEFAULT_QUERY_LIMIT, MAX_QUERY_LIMIT } from './Resource';
import { parseIntStrict, parseQueryLimit, parseQueryOffset, parseSearchTerm } from './Schema';

describe('parseIntStrict', () => {
	it('return the default integer when the parsed value is NaN', () => {
		const result = parseIntStrict(NaN, 0);

		expect(result).toStrictEqual(0);
	});

	it('return the default integer when the parsed value is a invalid string', () => {
		const result = parseIntStrict('not a number', 0);

		expect(result).toStrictEqual(0);
	});

	it('return the parsed value when its a valid number string', () => {
		{
			const result = parseIntStrict('123', 0);

			expect(result).toStrictEqual(123);
		}
		{
			const result = parseIntStrict('-123', 0);

			expect(result).toStrictEqual(-123);
		}
	});
});

describe('parseQueryLimit', () => {
	it('return 0 when the parsed value is negative', () => {
		const result = parseQueryLimit(-50);

		expect(result).toStrictEqual(0);
	});

	it('return the default query limit when the parsed value is invalid', () => {
		const result = parseQueryLimit('invalid');

		expect(result).toStrictEqual(DEFAULT_QUERY_LIMIT);
	});

	it('return the maximum query limit when the parsed value is greater than the maximum query limit', () => {
		const result = parseQueryLimit(MAX_QUERY_LIMIT + 2);

		expect(result).toStrictEqual(MAX_QUERY_LIMIT);
	});

	it('return the parsed value when its between 0 and the maximum query limit', () => {
		const values = [9, 10, 4, 5, 15];

		for (const value of values) {
			const result = parseQueryLimit(value);
			expect(result).toStrictEqual(value);
		}
	});

	it('return the parsed value when its a valid number string', () => {
		const result = parseQueryLimit('10');

		expect(result).toStrictEqual(10);
	});
});

describe('parseQueryOffset', () => {
	it('return 0 when the parsed value is negative', () => {
		const result = parseQueryOffset(-23);

		expect(result).toStrictEqual(0);
	});

	it('return 0 when the parsed value is invalid', () => {
		const result = parseQueryOffset(NaN);

		expect(result).toStrictEqual(0);
	});

	it('return the parsed value when its greater than 0', () => {
		const values = [10, 5, 15, 50, 150, 2000];

		for (const value of values) {
			const result = parseQueryOffset(value);
			expect(result).toStrictEqual(value);
		}
	});

	it('return the parsed value when its a valid number string', () => {
		const result = parseQueryOffset('360');

		expect(result).toStrictEqual(360);
	});
});

describe('parseSearchTerm', () => {
	it('return undefined when the parsed value has a length greater than 128', () => {
		const largeText =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ornare, odio' +
			' vitae condimentum ultrices, turpis lacus placerat nulla';

		const result = parseSearchTerm(largeText);

		expect(result).toStrictEqual(undefined);
	});

	it('return the parsed value when the length is less than or equal to 128', () => {
		const text = 'small search term';

		const result = parseSearchTerm(text);

		expect(result).toStrictEqual(text);
	});

	it('return undefined when the parsed value is undefined', () => {
		const result = parseSearchTerm(undefined);

		expect(result).toStrictEqual(undefined);
	});
});
