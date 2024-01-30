import { z } from 'zod';
import { DEFAULT_QUERY_LIMIT, MAX_QUERY_LIMIT } from '@/module/shared/Resource';

const ULID_LENGTH = 26;
const ULID_REGEX = /^[\dA-HJKMNP-TV-Z]{26}$/;

/**
 * Ulid schema
 *
 * Validate a {@link https://github.com/ulid/spec Ulid}.
 */
export const UlidSchema = z
	.string()
	.length(ULID_LENGTH, { message: 'ULID length is not 26' })
	.regex(ULID_REGEX, { message: 'ULID is invalid' });

export function parseIntStrict(value: unknown, defaultInt: number = 0): number {
	const num = Number(value);

	if (isNaN(num)) {
		return defaultInt;
	}

	return Math.trunc(num);
}

export function parseQueryLimit(value: unknown): number {
	const limit = parseIntStrict(value, DEFAULT_QUERY_LIMIT);
	return Math.max(Math.min(limit, MAX_QUERY_LIMIT), 0);
}

export function parseQueryOffset(value: unknown): number {
	const offset = parseIntStrict(value);
	return Math.max(offset, 0);
}

/**
 * Query limit schema
 *
 * Validate and transform the query limit.
 */
export const QueryLimitSchema = z.any().transform(parseQueryLimit);

/**
 * Query offset schema
 *
 * Validate the query offset.
 */
export const QueryOffsetSchema = z.any().transform(parseQueryOffset);

export const SEARCH_TERM_MAX_LENGTH = 128;

export function parseSearchTerm(value: unknown): string | undefined {
	if (value === undefined) return undefined;

	const str = String(value);
	if (str.length > SEARCH_TERM_MAX_LENGTH) {
		return undefined;
	}

	return str;
}

export const SearchTermSchema = z.any().transform(parseSearchTerm);
