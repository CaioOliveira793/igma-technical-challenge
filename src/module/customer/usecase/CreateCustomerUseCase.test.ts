import { ConflictError } from '@/exception/resource/ConflictError';
import { CUSTOMER_RESOURCE_NAME } from '@/module/customer/dto/Resource';
import { CustomerMemRepository } from '@/module/customer/service/impl/CustomerMemRepository';
import { CreateCustomerUseCase } from '@/module/customer/usecase/CreateCustomerUseCase';
import { fakeCPF } from '@/module/customer/validation/cpf.fake';
import { fakeCreateCustomerData, fakeCustomer } from '@/module/customer/entity/Customer.fake';

describe('CreateCustomerUseCase', () => {
	it('create a new customer and return the customer entity', async () => {
		const repository = new CustomerMemRepository();
		const usecase = new CreateCustomerUseCase(repository);

		const data = fakeCreateCustomerData();
		const customer = await usecase.execute(data);

		expect(customer.cpf).toStrictEqual(data.cpf);
		expect(customer.name).toStrictEqual(data.name);
		expect(customer.birthdate).toStrictEqual(data.birthdate);
	});

	it('create a new customer and insert the customer entity into the repository', async () => {
		const repository = new CustomerMemRepository();
		const usecase = new CreateCustomerUseCase(repository);

		const data = fakeCreateCustomerData();
		const customer = await usecase.execute(data);

		const savedCustomer = await repository.find(customer.id);

		expect(savedCustomer).not.toStrictEqual(null);

		expect(savedCustomer!.internalState()).toStrictEqual(customer.internalState());
	});

	it('throw a conflict error when creating a customer with a cpf already in the repository', async () => {
		const repository = new CustomerMemRepository();
		const usecase = new CreateCustomerUseCase(repository);
		const cpf = fakeCPF();
		await repository.insert(fakeCustomer({ cpf }));

		const data = fakeCreateCustomerData({ cpf });

		await expect(() => usecase.execute(data)).rejects.toThrow(
			new ConflictError({
				path: 'cpf',
				resource_key: 'cpf:' + cpf,
				resource_type: CUSTOMER_RESOURCE_NAME,
			})
		);
	});
});
