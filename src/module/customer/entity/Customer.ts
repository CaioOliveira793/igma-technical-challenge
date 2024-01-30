import { ulid } from 'ulid';
import { Entity } from '@/module/shared/Entity';

/**
 * Customer state
 */
export interface CustomerState {
	/**
	 * Customer name
	 *
	 * - minimum of 2 characters.
	 * - maximum of 256 characters.
	 */
	readonly name: string;
	/**
	 * CPF
	 */
	readonly cpf: string;
	/**
	 * Customer birthdate
	 *
	 * - must be in the past.
	 */
	readonly birthdate: Date;
	/**
	 * Created
	 *
	 * Creation date.
	 */
	readonly created: Date;
}

/**
 * Create customer data
 *
 * Valid customer creation data.
 */
export interface CreateCustomerData {
	readonly name: string;
	readonly cpf: string;
	readonly birthdate: Date;
}

/**
 * Customer entity
 */
export class Customer extends Entity<CustomerState> {
	/**
	 * Create a new customer entity from a valid customer creation data (`CreateCustomerData`).
	 *
	 * @param data customer creation data
	 * @returns a new customer entity
	 */
	public static create(data: CreateCustomerData): Customer {
		return new Customer(ulid(), {
			created: new Date(),
			cpf: data.cpf,
			name: data.name,
			birthdate: data.birthdate,
		});
	}

	/**
	 * Restores a customer entity with an ID and a state.
	 *
	 * @param id entity ID
	 * @param state customer entity state
	 * @returns a restored customer entity
	 */
	public static restore(id: string, state: CustomerState): Customer {
		return new Customer(id, state);
	}

	public get name(): string {
		return this.state.name;
	}

	public get cpf(): string {
		return this.state.cpf;
	}

	public get birthdate(): Date {
		return this.state.birthdate;
	}

	public get created(): Date {
		return this.state.created;
	}
}
