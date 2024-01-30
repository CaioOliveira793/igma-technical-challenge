import { z } from 'zod';
import { isBefore } from 'date-fns';
import { IssueType } from '@/exception/ErrorTypes';
import { isCPFvalid, unformatCPF } from '@/module/customer/validation/cpf';

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

/**
 * Customer name schema
 *
 * Validate a customer name.
 *
 * - minimum of 2 characters.
 * - maximum of 256 characters.
 */
export const CustomerNameSchema = z.string().min(2).max(256);

function cpfRefinement(cpf: string, ctx: z.RefinementCtx): string {
	if (!isCPFvalid(cpf)) {
		ctx.addIssue({
			code: IssueType.Custom,
			message: 'CPF is invalid',
			fatal: true,
		});

		return z.NEVER;
	}

	return cpf;
}

/**
 * CPF schema
 *
 * Validate CPF.
 */
export const CPFSchema = z.string().superRefine(cpfRefinement).transform(unformatCPF);

function isDateInPast(date: Date, now: Date = new Date()) {
	return isBefore(date, now);
}

/**
 * Customer birthdate schema
 *
 * Validate a customer birthdate.
 *
 * - must be a valid date.
 * - must be in the past.
 */
export const CustomerBirthdateSchema = z.date().refinement(isDateInPast, {
	code: IssueType.InvalidDate,
	message: 'customer birthdate is in the future',
});

/**
 * Create customer schema
 *
 * Validate `CreateCustomerData`.
 */
export const CreateCustomerSchema = z.object({
	name: CustomerNameSchema,
	cpf: CPFSchema,
	birthdate: CustomerBirthdateSchema,
});
