import { HttpStatus } from '@nestjs/common';
import { RequestSegment } from '@/http/types';
import { AppError, HttpErrorObject } from '@/exception/AppError';
import { ValidationIssue } from '@/exception/ErrorTypes';

export class RequestError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly segment: RequestSegment;
	public readonly issues: ValidationIssue[];

	public constructor(segment: RequestSegment, issues: ValidationIssue[]) {
		super('Request error');
		this.segment = segment;
		this.issues = issues;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.BAD_REQUEST,
			error: this.error,
			segment: this.segment,
			message: this.message,
			issues: this.issues,
		};
	}
}
