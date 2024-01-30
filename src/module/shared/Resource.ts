/**
 * Resource list
 *
 * A list of resources with associated metadata as a result of a list request.
 */
export interface ResourceList<Resource> {
	/**
	 * List of resources.
	 */
	data: Array<Resource>;
	/**
	 * Limit of resources for the result of the query.
	 */
	limit: number;
	/**
	 * Number of resources found.
	 */
	count: number;
	/**
	 * Next page.
	 */
	next: number;
	/**
	 * Previous page.
	 */
	prev: number;
}
