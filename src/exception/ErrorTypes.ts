import { ZodIssue } from 'zod';

/**
 * Resource location
 *
 * A description of a reference to a resource.
 */
export interface ResourceLocation {
	/**
	 * Path
	 *
	 * The location from which the resource was referenced.
	 */
	path: string | null;
	/**
	 * Resource key
	 *
	 * A unique key that can identify a single resource.
	 */
	resource_key: string;
	/**
	 * Resource type
	 */
	resource_type: string;
}

/**
 * Validation Issue type
 *
 * The different validation issue types. Taken from {ZodIssueCode}.
 */
export const enum IssueType {
	InvalidContent = 'invalid_content',
	InvalidType = 'invalid_type',
	InvalidLiteral = 'invalid_literal',
	Custom = 'custom',
	InvalidUnion = 'invalid_union',
	InvalidUnionDiscriminator = 'invalid_union_discriminator',
	InvalidEnumValue = 'invalid_enum_value',
	UnrecognizedKeys = 'unrecognized_keys',
	InvalidArguments = 'invalid_arguments',
	InvalidReturnType = 'invalid_return_type',
	InvalidDate = 'invalid_date',
	InvalidString = 'invalid_string',
	TooSmall = 'too_small',
	TooBig = 'too_big',
	InvalidIntersectionTypes = 'invalid_intersection_types',
	NotMultipleOf = 'not_multiple_of',
	NotFinite = 'not_finite',
}

/**
 * Validation issue
 */
export interface ValidationIssue {
	readonly type: IssueType;
	readonly path: string | null;
	readonly message: string;
}

/**
 * Transform a `ZodIssue` into a `ValidationIssue`.
 *
 * @param issue zod issue
 * @returns a validation issue
 */
export function zodIssueToValidationIssue(issue: ZodIssue): ValidationIssue {
	return {
		message: issue.message,
		path: issue.path.join('.'),
		type: issue.code as IssueType,
	};
}
