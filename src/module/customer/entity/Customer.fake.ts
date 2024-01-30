import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';
import { Customer, CustomerState } from '@/module/customer/entity/Customer';
import { fakeCPF } from '@/module/customer/validation/cpf.fake';

/**
 * Generates a valid customer entity.
 *
 * @param state partial customer state
 * @param id optional entity id
 * @returns valid customer entity
 */
export function fakeCustomer(state: Partial<CustomerState> = {}, id = ulid()): Customer {
	return Customer.restore(id, fakeCustomerState(state));
}

/**
 * Generates a valid customer state based on a partial provided state.
 *
 * @param state partial customer state
 * @returns valid customer state
 */
export function fakeCustomerState(state: Partial<CustomerState> = {}): CustomerState {
	const created = state.created ?? faker.date.past();
	return {
		created,
		cpf: state.cpf ?? fakeCPF(),
		name: state.name ?? faker.person.fullName(),
		birthdate: state.birthdate ?? faker.date.past({ refDate: created, years: 10 }),
	};
}
