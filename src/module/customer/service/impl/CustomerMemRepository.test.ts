import { ulid } from 'ulid';
import { CustomerMemRepository } from '@/module/customer/service/impl/CustomerMemRepository';
import { fakeCustomer } from '@/module/customer/entity/Customer.fake';
import { fakeCPF } from '@/module/customer/validation/cpf.fake';

describe('CustomerMemRepository', () => {
	it('insert a new customer into the repository', async () => {
		const repository = new CustomerMemRepository();

		const customer = fakeCustomer();
		await repository.insert(customer);

		const insertedCustomer = await repository.find(customer.id);

		expect(insertedCustomer).not.toStrictEqual(null);
		expect(insertedCustomer!.internalState()).toStrictEqual(customer.internalState());
	});

	it('throw an error when insert a customer with an id already in the repository', async () => {
		const commonID = ulid();
		const repository = new CustomerMemRepository();

		await repository.insert(fakeCustomer({}, commonID));

		await expect(() => repository.insert(fakeCustomer({}, commonID))).rejects.toThrow(
			new Error(CustomerMemRepository.UNIQUE_ID_MESSAGE)
		);
	});

	it('throws an error when insert a customer with a cpf already in the repository', async () => {
		const commonCPF = fakeCPF();
		const repository = new CustomerMemRepository();

		await repository.insert(fakeCustomer({ cpf: commonCPF }));

		await expect(() => repository.insert(fakeCustomer({ cpf: commonCPF }))).rejects.toThrow(
			new Error(CustomerMemRepository.UNIQUE_CPF_MESSAGE)
		);
	});

	it('find a customer by the id in the repository', async () => {
		const customerID = ulid();
		const customer = fakeCustomer({}, customerID);
		const repository = new CustomerMemRepository();

		await repository.insert(customer);

		const customerFound = await repository.find(customerID);

		expect(customerFound).not.toStrictEqual(null);
		expect(customerFound!.id).toStrictEqual(customerID);
		expect(customerFound!.internalState()).toStrictEqual(customer.internalState());
	});

	it('not find a customer by the id when is not present in the repository', async () => {
		const customer = fakeCustomer();
		const repository = new CustomerMemRepository();

		const orderFound = await repository.find(customer.id);

		expect(orderFound).toStrictEqual(null);
	});

	it('find a customer by the cpf in the repository', async () => {
		const customer = fakeCustomer();
		const repository = new CustomerMemRepository();

		await repository.insert(customer);
		const customerFound = await repository.findByCPF(customer.cpf);

		expect(customerFound).not.toStrictEqual(null);
		expect(customerFound!.id).toStrictEqual(customer.id);
		expect(customerFound!.internalState()).toStrictEqual(customer.internalState());
	});

	it('not find a customer by the cpf when is not present in the repository', async () => {
		const customer = fakeCustomer();
		const repository = new CustomerMemRepository();

		const customerFound = await repository.findByCPF(customer.cpf);

		expect(customerFound).toStrictEqual(null);
	});

	it('query customers sorting the result in descending order by the "created" field', async () => {
		const repository = new CustomerMemRepository();
		const limit = 30;
		const offset = 0;
		const customers = new Array(50).fill(null).map(() => fakeCustomer());

		for (const customer of customers) {
			await repository.insert(customer);
		}

		const expectedIDs = customers
			// ORBDER BY created DESC
			.sort((a, b) => b.created.getTime() - a.created.getTime())
			// OFFSET 0 LIMIT 30
			.slice(offset, offset + limit)
			.map(o => o.id);

		const result = await repository.query({ limit, offset });

		expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
	});

	it('query customers skipping 20 with a sorted result', async () => {
		const repository = new CustomerMemRepository();
		const limit = 30;
		const offset = 20;
		const customers = new Array(60).fill(null).map(() => fakeCustomer());

		for (const customer of customers) {
			await repository.insert(customer);
		}

		const expectedIDs = customers
			// ORBDER BY created DESC
			.sort((a, b) => b.created.getTime() - a.created.getTime())
			// OFFSET 20 LIMIT 30
			.slice(offset, offset + limit)
			.map(o => o.id);

		const result = await repository.query({ limit, offset });

		expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
	});

	it('query customers filtering by the "name" field skipping 5', async () => {
		const repository = new CustomerMemRepository();
		const limit = 30;
		const offset = 5;
		const searchTerm = 'Julius Caesar';
		const customers = new Array(50)
			.fill(null)
			.map(() => (Math.random() > 0.5 ? fakeCustomer({ name: searchTerm }) : fakeCustomer()));

		for (const customer of customers) {
			await repository.insert(customer);
		}

		const expectedIDs = customers
			// ORBDER BY created DESC
			.sort((a, b) => b.created.getTime() - a.created.getTime())
			// WHERE order.name LIKE %{name}%
			.filter(o => o.name.includes(searchTerm))
			// OFFSET 5 LIMIT 30
			.slice(offset, offset + limit)
			.map(o => o.id);

		const result = await repository.query({ limit, offset, name: searchTerm });

		expect(result.map(resource => resource.id)).toStrictEqual(expectedIDs);
	});
});
