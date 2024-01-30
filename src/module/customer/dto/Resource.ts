import { Customer } from '@/module/customer/entity/Customer';

/**
 * Customer resource
 */
export interface CustomerResource {
	/**
	 * Unique ID
	 */
	readonly id: string;
	/**
	 * Name
	 */
	readonly name: string;
	/**
	 * CPF (unmasked)
	 */
	readonly cpf: string;
	/**
	 * Customer birthdate
	 */
	readonly birthdate: Date;
	/**
	 * Creation date
	 */
	readonly created: Date;
}

export const CUSTOMER_RESOURCE_NAME = 'CUSTOMER';

/**
 * Transform a customer entity into a resource.
 *
 * @param customer customer entity
 * @returns customer resource
 */
export function makeCustomerResource(customer: Customer): CustomerResource {
	return {
		id: customer.id,
		created: customer.created,
		cpf: customer.cpf,
		name: customer.name,
		birthdate: customer.birthdate,
	};
}

/**
 * Customer query params.
 */
export interface CustomerQueryParams {
	/**
	 * Name
	 *
	 * The customer name can be used as a search term in a query.
	 */
	name?: string;
}
