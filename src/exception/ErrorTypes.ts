import { ZodIssue } from 'zod';

export interface ResourceLocation {
	path: string | null;
	key: string;
	resource_type: string;
}

/// from {ZodIssueCode}
export const enum DataIssueType {
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

export interface InvalidDataIssue {
	message: string;
	path: string | null;
	type: DataIssueType;
}

export function zodIssueToInvalidDataIssue(issue: ZodIssue): InvalidDataIssue {
	return {
		message: issue.message,
		path: issue.path.join('.'),
		type: issue.code as DataIssueType,
	};
}
