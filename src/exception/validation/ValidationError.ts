import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/AppError';
import { ValidationIssue } from '@/exception/ErrorTypes';

export const enum ValidationUsage {
	Entity,
	Request,
}

function validationTypeToStatusCode(type: ValidationUsage): HttpStatus {
	switch (type) {
		case ValidationUsage.Entity:
			return HttpStatus.UNPROCESSABLE_ENTITY;
		case ValidationUsage.Request:
			return HttpStatus.BAD_REQUEST;
	}
}

export class ValidationError extends AppError {
	public readonly error: string = 'VALIDATION';
	public readonly issues: ValidationIssue[];
	public readonly usage: ValidationUsage;

	constructor(issues: ValidationIssue[], usage: ValidationUsage) {
		super('Validation error');
		this.issues = issues;
		this.usage = usage;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: validationTypeToStatusCode(this.usage),
			error: this.error,
			message: this.message,
			issues: this.issues,
		};
	}
}
