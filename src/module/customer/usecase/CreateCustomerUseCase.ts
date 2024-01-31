import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@/exception/resource/ConflictError';
import { CUSTOMER_RESOURCE_NAME } from '@/module/customer/dto/Resource';
import { CreateCustomerData, Customer } from '@/module/customer/entity/Customer';
import {
	CUSTOMER_REPOSITORY_PROVIDER,
	CustomerRepository,
} from '@/module/customer/service/CustomerRepository';

@Injectable()
export class CreateCustomerUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_PROVIDER)
		private readonly customerRepository: CustomerRepository
	) {}

	public async execute(data: CreateCustomerData): Promise<Customer> {
		const customerFound = await this.customerRepository.findByCPF(data.cpf);
		if (customerFound) {
			throw new ConflictError({
				path: 'cpf',
				resource_type: CUSTOMER_RESOURCE_NAME,
				resource_key: 'cpf:' + data.cpf,
			});
		}

		const customer = Customer.create(data);
		await this.customerRepository.insert(customer);

		return customer;
	}
}
