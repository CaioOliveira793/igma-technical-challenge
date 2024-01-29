import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/AppError';
import { InvalidDataIssue } from '@/exception/ErrorTypes';

export class ValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly issues: InvalidDataIssue[];

	constructor(issues: InvalidDataIssue[]) {
		super('Validation error');
		this.issues = issues;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.UNPROCESSABLE_ENTITY,
			error: this.error,
			message: this.message,
			issues: this.issues,
		};
	}
}
