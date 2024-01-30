import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';
import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';
import { logLevel } from '@/config/ConfigOptions';
import { RequestError } from '@/exception/validation/RequestError';
import { RequestSegment } from '@/http/types';
import { IssueType, ValidationIssue } from '@/exception/ErrorTypes';
import { removeStackTrace } from '@/util/error';

const BODY_LIMIT = 512 * 1024; // 512 KB
const CONNECTION_TIMEOUT = 10_000; // 10 seconds
const KEEP_ALIVE_TIMEOUT = 90_000; // 1 min 30 seconds

export function fastifyInstance(): FastifyInstance {
	const instance = fastify({
		logger: { level: logLevel() },
		bodyLimit: BODY_LIMIT,
		connectionTimeout: CONNECTION_TIMEOUT,
		keepAliveTimeout: KEEP_ALIVE_TIMEOUT,
		ignoreTrailingSlash: false,
		maxParamLength: 64,
	});

	instance.removeContentTypeParser('application/json');
	instance.addContentTypeParser('application/json', { parseAs: 'string' }, jsonContentTypeParser);

	instance.register(cors, { origin: true });

	return instance;
}

const JSON_BODY_ERROR_MESSAGE = 'An error occurred parsing the request body as JSON';

function jsonContentTypeParser(
	request: FastifyRequest,
	body: string,
	done: ContentTypeParserDoneFunction
) {
	try {
		const json = JSON.parse(body, reviver);
		done(null, json);
	} catch (err: unknown) {
		const validationIssue: ValidationIssue = {
			message: (err as Error)?.message ?? JSON_BODY_ERROR_MESSAGE,
			path: null,
			type: IssueType.InvalidContent,
		};
		const error = new RequestError(RequestSegment.Body, [validationIssue]);
		request.log.info(removeStackTrace(error, true), error.message);
		done(error, undefined);
	}
}

function reviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}
