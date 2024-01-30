import { Customer } from '@/module/customer/entity/Customer';
import { CustomerQueryParams, CustomerResource } from '@/module/customer/dto/Resource';

export interface CustomerRepository {
	insert(customer: Customer): Promise<void>;
	find(id: string): Promise<Customer | null>;
	findByCPF(cpf: string): Promise<Customer | null>;
	query(params: CustomerQueryParams): Promise<Array<CustomerResource>>;
}

export const CUSTOMER_REPOSITORY_PROVIDER = 'CUSTOMER_REPOSITORY_PROVIDER';
