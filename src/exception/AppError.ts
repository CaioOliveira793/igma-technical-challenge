import { HttpStatus } from '@nestjs/common';
import { Request, Response } from '@/http/types';

export interface HttpErrorObject extends Record<string, unknown> {
	status: number;
	error: string;
	message: string;
}

export interface HttpBaseError {
	/**
	 * Write the HTTP error into the response.
	 *
	 * @param {Readonly<Request>} request Readonly request
	 * @param {Response} response Response which the error will be written
	 */
	toHttp(request: Readonly<Request>, response: Response): void;

	httpErrorObject(): HttpErrorObject;
}

export class AppError extends Error implements HttpBaseError {
	public httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			error: 'INTERNAL_SERVER_ERROR',
			message: 'Server encountered an error processing the request',
		};
	}

	public toHttp(_: Readonly<Request>, response: Response): void {
		const data = this.httpErrorObject();
		response.statusCode = data.status;
		response.send(data);
	}
}
