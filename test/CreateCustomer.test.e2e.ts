import { addDays } from 'date-fns';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { HttpErrorObject } from '@/exception/AppError';
import {
	fakeCreateCustomerData,
	fakeCustomerBirthdate,
	fakeCustomerName,
} from '@/module/customer/entity/Customer.fake';
import { CustomerResource } from '@/module/customer/dto/Resource';
import { fakeCPF } from '@/module/customer/validation/cpf.fake';
import { databaseSetup } from '@test/script/databaseSetup';
import { makeTestApplication } from './script/makeTestApplication';

describe('POST /customer', () => {
	let app: NestFastifyApplication;

	beforeAll(async () => {
		app = await makeTestApplication();
	});

	beforeEach(async () => {
		await databaseSetup();
	});

	it('return status code 201 when create a customer using valid data', async () => {
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

		const customer: CustomerResource = result.json();

		expect(result.statusCode).toStrictEqual(201);

		expect(customer.cpf).toStrictEqual(data.cpf);
		expect(customer.name).toStrictEqual(data.name);
		expect(customer.birthdate).toStrictEqual(data.birthdate.toISOString());
	});

	it('return status code 422 when create a customer with a invalid CPF', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/customer',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				name: fakeCustomerName(),
				cpf: '000.000.000-01',
				birthdate: fakeCustomerBirthdate(),
			}),
		});

		const errorObject: HttpErrorObject = result.json();

		expect(result.statusCode).toStrictEqual(422);
		expect(errorObject.status).toStrictEqual(422);
	});

	it('return status code 422 when create a customer with a birthdate in the future', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/customer',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				name: fakeCustomerName(),
				cpf: fakeCPF(),
				birthdate: addDays(new Date(), 3),
			}),
		});

		const errorObject: HttpErrorObject = result.json();

		expect(result.statusCode).toStrictEqual(422);
		expect(errorObject.status).toStrictEqual(422);
	});

	it('return status code 409 when create a customer with a CPF that is already in the API', async () => {
		const cpf = fakeCPF();
		{
			const data = fakeCreateCustomerData({ cpf });
			const result = await app.inject({
				method: 'POST',
				url: '/customer',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(data),
			});

			expect(result.statusCode).toStrictEqual(201);
		}

		const data = fakeCreateCustomerData({ cpf });
		const result = await app.inject({
			method: 'POST',
			url: '/customer',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(data),
		});

		const errorObject: HttpErrorObject = result.json();

		expect(result.statusCode).toStrictEqual(409);
		expect(errorObject.status).toStrictEqual(409);
	});

	afterAll(async () => {
		await app.close();
	});
});
