/**
 * Base entity class
 */
export abstract class Entity<T> {
	/**
	 * Unique entity id
	 */
	public readonly id: string;
	/**
	 * Entity state
	 *
	 * The entity state represents all the data of a entity in a valid state.
	 */
	protected state: T;

	protected constructor(id: string, state: T) {
		this.id = id;
		this.state = state;
	}

	/**
	 * Returns a copy of the current entity state.
	 *
	 * @returns A deep clone of the current entity state.
	 */
	public internalState(): T {
		return structuredClone(this.state);
	}
}
