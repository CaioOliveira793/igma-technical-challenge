import { HttpErrorObject } from '@/exception/AppError';
import { CustomerResource } from '@/module/customer/dto/Resource';
import { fakeCreateCustomerData } from '@/module/customer/entity/Customer.fake';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { databaseSetup } from '@test/script/databaseSetup';
import { makeTestApplication } from '@test/script/makeTestApplication';
import { ulid } from 'ulid';

describe('GET /customer/:id', () => {
	let app: NestFastifyApplication;

	beforeAll(async () => {
		app = await makeTestApplication();
	});

	beforeEach(async () => {
		await databaseSetup();
	});

	it('get a customer from the api with a valid ID', async () => {
		const data = fakeCreateCustomerData();
		const postResult = await app.inject({
			method: 'POST',
			url: '/customer',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(data),
		});

		const createdCustomer: CustomerResource = postResult.json();

		expect(postResult.statusCode).toStrictEqual(201);

		const result = await app.inject({
			method: 'GET',
			url: '/customer/' + createdCustomer.id,
			headers: {
				Accept: 'application/json',
			},
		});

		const returnedCustomer: CustomerResource = postResult.json();

		expect(result.statusCode).toStrictEqual(200);
		expect(returnedCustomer).toStrictEqual(createdCustomer);
	});

	it('return status 404 when requesting a customer that is not in the API', async () => {
		const result = await app.inject({
			method: 'GET',
			url: '/customer/' + ulid(),
			headers: {
				Accept: 'application/json',
			},
		});

		const error: HttpErrorObject = result.json();

		expect(result.statusCode).toStrictEqual(404);
		expect(error.status).toStrictEqual(404);
	});

	it('return status 400 when requesting a customer with a invalid ID', async () => {
		const result = await app.inject({
			method: 'GET',
			url: '/customer/' + ulid() + '1',
			headers: {
				Accept: 'application/json',
			},
		});

		const error: HttpErrorObject = result.json();

		expect(result.statusCode).toStrictEqual(400);
		expect(error.status).toStrictEqual(400);
	});

	afterAll(async () => {
		await app.close();
	});
});
