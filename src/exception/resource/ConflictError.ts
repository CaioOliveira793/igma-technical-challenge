import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/AppError';
import { ResourceLocation } from '@/exception/ErrorTypes';

export class ConflictError extends AppError {
	public readonly error = 'CONFLICT';
	public readonly resource: ResourceLocation;

	constructor(resource: ResourceLocation) {
		super('Resource conflict error');
		this.resource = resource;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.CONFLICT,
			error: this.error,
			message: this.message,
			resource: this.resource,
		};
	}
}
