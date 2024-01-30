import { Injectable, Optional, Provider } from '@nestjs/common';
import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { Customer, CustomerState } from '@/module/customer/entity/Customer';
import {
	CUSTOMER_REPOSITORY_PROVIDER,
	CustomerRepository,
} from '@/module/customer/service/CustomerRepository';
import {
	CustomerQueryParams,
	CustomerResource,
	mountCustomerResource,
} from '@/module/customer/dto/Resource';

@Injectable()
export class CustomerMemRepository implements CustomerRepository {
	public static readonly UNIQUE_CPF_MESSAGE =
		uniqueConstraintViolationMessage('customer_unique_cpf');
	public static readonly UNIQUE_ID_MESSAGE = uniqueConstraintViolationMessage('customer_unique_id');

	public constructor(@Optional() customers: Map<string, CustomerState> = new Map()) {
		this.customers = customers;
	}

	public async insert(customer: Customer): Promise<void> {
		if (this.customers.get(customer.id)) {
			throw new Error(CustomerMemRepository.UNIQUE_ID_MESSAGE);
		}
		if (this.idFromCPF(customer.cpf)) {
			throw new Error(CustomerMemRepository.UNIQUE_CPF_MESSAGE);
		}

		this.customers.set(customer.id, customer.internalState());
	}

	public async find(id: string): Promise<Customer | null> {
		const state = this.customers.get(id);
		if (state) {
			return Customer.restore(id, structuredClone(state));
		}

		return null;
	}

	public async findByCPF(cpf: string): Promise<Customer | null> {
		for (const [id, state] of this.customers.entries()) {
			if (state.cpf === cpf) {
				return Customer.restore(id, structuredClone(state));
			}
		}

		return null;
	}

	public async query(params: CustomerQueryParams): Promise<CustomerResource[]> {
		const customers: Array<CustomerResource> = [];

		for (const [id, state] of this.customers.entries()) {
			// WHERE customer.name LIKE %{name}%
			if (params.name && !state.name.includes(params.name)) {
				continue;
			}

			customers.push(mountCustomerResource(id, state));
		}

		// ORDER BY created DESC
		customers.sort((a, b) => b.created.getTime() - a.created.getTime());

		// LIMIT {limit} OFFSET {offset}
		return customers.slice(params.offset, params.offset + params.limit);
	}

	private idFromCPF(cpf: string): string | null {
		for (const [id, state] of this.customers.entries()) {
			if (state.cpf === cpf) return id;
		}
		return null;
	}

	private readonly customers: Map<string, CustomerState>;
}

export const CustomerMemRepositoryProvider: Provider<CustomerRepository> = {
	provide: CUSTOMER_REPOSITORY_PROVIDER,
	useClass: CustomerMemRepository,
};
