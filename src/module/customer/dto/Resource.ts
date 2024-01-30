import { Customer, CustomerState } from '@/module/customer/entity/Customer';
import { OffsetQuery } from '@/module/shared/Resource';

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
 * Mount a customer resource from a ID and the customer state
 *
 * @param id entity ID
 * @param state customer state
 * @returns customer resource
 */
export function mountCustomerResource(id: string, state: CustomerState): CustomerResource {
	return {
		id,
		cpf: state.cpf,
		created: state.created,
		birthdate: state.birthdate,
		name: state.name,
	};
}

/**
 * Customer query params.
 */
export interface CustomerQueryParams extends OffsetQuery {
	/**
	 * Name
	 *
	 * The customer name can be used as a search term in a query.
	 */
	name?: string;
}
