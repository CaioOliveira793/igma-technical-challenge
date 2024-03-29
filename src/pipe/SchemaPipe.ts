import { Injectable, Optional, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';
import { ValidationError, ValidationUsage } from '@/exception/validation/ValidationError';
import { zodIssueToValidationIssue } from '@/exception/ErrorTypes';

@Injectable()
export class SchemaPipe<T> implements PipeTransform {
	public constructor(
		@Optional()
		private readonly schema: Schema<T>,
		@Optional()
		private readonly usage: ValidationUsage = ValidationUsage.Request
	) {}

	public async transform(value: unknown): Promise<T> {
		const result = await this.schema.safeParseAsync(value);
		if (!result.success) {
			throw new ValidationError(result.error.issues.map(zodIssueToValidationIssue), this.usage);
		}

		return result.data;
	}
}
