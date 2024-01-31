import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fakeCreateCustomerData } from '@/module/customer/entity/Customer.fake';
import { CustomerResource } from '@/module/customer/dto/Resource';
import { DEFAULT_QUERY_LIMIT, QueryResult } from '@/module/shared/Resource';
import { databaseSetup } from '@test/script/databaseSetup';
import { makeTestApplication } from '@test/script/makeTestApplication';

async function insertCustomer(app: NestFastifyApplication): Promise<CustomerResource> {
	const data = fakeCreateCustomerData();
	const result = await app.inject({
		method: 'POST',
		url: '/customer',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(data),
	});

	return result.json() as CustomerResource;
}

describe('GET /customer', () => {
	let app: NestFastifyApplication;

	beforeAll(async () => {
		app = await makeTestApplication();
	});

	beforeEach(async () => {
		await databaseSetup();
	});

	it('return a query result with a list of customers', async () => {
		const customers = await Promise.all([
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
		]);
		const ids = customers.reverse().map(c => c.id);

		const result = await app.inject({
			method: 'GET',
			url: '/customer',
			headers: {
				Accept: 'application/json',
			},
		});

		const queryResult: QueryResult<CustomerResource> = result.json();

		expect(queryResult.count).toStrictEqual(5);
		expect(queryResult.limit).toStrictEqual(DEFAULT_QUERY_LIMIT);
		expect(queryResult.offset).toStrictEqual(0);
		expect(queryResult.next).toStrictEqual(null);
		expect(queryResult.prev).toStrictEqual(0);
		expect(queryResult.list.length).toStrictEqual(5);
		expect(queryResult.list.map(c => c.id)).toStrictEqual(ids);
	});

	it('return a query result with a limit of 3 customers', async () => {
		const customers = await Promise.all([
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
		]);
		const ids = customers
			.reverse()
			.slice(0, 3)
			.map(c => c.id);

		const result = await app.inject({
			method: 'GET',
			url: '/customer?limit=3',
			headers: {
				Accept: 'application/json',
			},
		});

		const queryResult: QueryResult<CustomerResource> = result.json();

		expect(queryResult.count).toStrictEqual(3);
		expect(queryResult.limit).toStrictEqual(3);
		expect(queryResult.offset).toStrictEqual(0);
		expect(queryResult.next).toStrictEqual(3);
		expect(queryResult.prev).toStrictEqual(0);
		expect(queryResult.list.length).toStrictEqual(3);
		expect(queryResult.list.map(c => c.id)).toStrictEqual(ids);
	});

	it('return a query result with a limit of 2 customers skipping the first 2', async () => {
		const customers = await Promise.all([
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
			await insertCustomer(app),
		]);
		const ids = customers
			.reverse()
			.slice(2, 2 + 2)
			.map(c => c.id);

		const result = await app.inject({
			method: 'GET',
			url: '/customer?limit=2&offset=2',
			headers: {
				Accept: 'application/json',
			},
		});

		const queryResult: QueryResult<CustomerResource> = result.json();

		expect(queryResult.count).toStrictEqual(2);
		expect(queryResult.limit).toStrictEqual(2);
		expect(queryResult.offset).toStrictEqual(2);
		expect(queryResult.next).toStrictEqual(2 + 2);
		expect(queryResult.prev).toStrictEqual(2 - 2);
		expect(queryResult.list.length).toStrictEqual(2);
		expect(queryResult.list.map(c => c.id)).toStrictEqual(ids);
	});

	afterAll(async () => {
		await app.close();
	});
});
