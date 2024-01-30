import { FastifyRequest, FastifyReply } from 'fastify';
import { IncomingHttpHeaders } from 'http';

export type Request = FastifyRequest; // http.IncomingMessage | http2.Http2ServerRequest
export type Response = FastifyReply; // ServerResponse

export type HeaderKey = keyof IncomingHttpHeaders;
export type HeaderValue = IncomingHttpHeaders[HeaderKey];

/**
 * Request segment
 *
 * A segment that may be present in a http reauest.
 */
export const enum RequestSegment {
	Body = 'BODY',
	Params = 'PARAM',
	Query = 'QUERY',
	Headers = 'HEADER',
}
