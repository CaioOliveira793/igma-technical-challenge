/**
 * Query result
 *
 * A list of resources with associated metadata from the result of a query
 * request.
 */
export interface QueryResult<Resource> {
	/**
	 * List of resources.
	 */
	list: Array<Resource>;
	/**
	 * Number of resources found.
	 */
	count: number;
	/**
	 * Limit
	 *
	 * Limit of resources for the result of the query.
	 */
	limit: number;
	/**
	 * Offset
	 */
	offset: number;
	/**
	 * Next
	 *
	 * The offset that will return the next results of this query.
	 */
	next: number | null;
	/**
	 * Previous
	 *
	 * The offset that will return the previous results of this query.
	 */
	prev: number;
}

/**
 * Create a query result from the resource list and the query params used to
 * make the query.
 *
 * @param list resource list
 * @param params offset query params used in the query
 * @returns resource list
 */
export function makeQueryResult<Resource>(
	list: Array<Resource>,
	params: OffsetQuery
): QueryResult<Resource> {
	const count = list.length;
	const limit = params.limit;
	const next = count === params.limit ? params.offset + count : null;
	const prev = Math.max(params.offset - params.limit, 0);
	return { list, count, limit, offset: params.offset, next, prev };
}

/**
 * Offset pagination
 */
export interface OffsetQuery {
	/**
	 * Limit
	 *
	 * Limit of resources returned on this page. Maximum of 50.
	 *
	 * @default 30
	 */
	limit: number;
	/**
	 * Offset
	 *
	 * The number of skiped resources.
	 */
	offset: number;
}

export const DEFAULT_QUERY_LIMIT = 30;
