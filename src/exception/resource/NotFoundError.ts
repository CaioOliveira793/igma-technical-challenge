import { HttpStatus } from '@nestjs/common';
import { AppError, HttpErrorObject } from '@/exception/AppError';
import { ResourceLocation } from '@/exception/ErrorTypes';

export class NotFoundError extends AppError {
	public readonly error: string = 'NOT_FOUND';
	public readonly resource: ResourceLocation;

	constructor(resource: ResourceLocation) {
		super('Resource not found');
		this.resource = resource;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.NOT_FOUND,
			error: this.error,
			message: this.message,
			resource: this.resource,
		};
	}
}
