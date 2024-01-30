import { z } from 'zod';
import { MAX_QUERY_LIMIT } from '@/module/shared/Resource';

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

function clampQueryLimit(limit: number): number {
	return Math.min(limit, MAX_QUERY_LIMIT);
}

/**
 * Query limit schema
 *
 * Validate and transform the query limit.
 */
export const QueryLimitSchema = z.number({ coerce: true }).positive().transform(clampQueryLimit);

/**
 * Query offset schema
 *
 * Validate the query offset.
 */
export const QueryOffsetSchema = z.number({ coerce: true }).positive();
