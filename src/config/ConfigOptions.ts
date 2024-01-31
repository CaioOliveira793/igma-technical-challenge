import { env } from 'node:process';
import { ConfigModuleOptions } from '@nestjs/config';
import { NodeEnv, validateEnvVariables } from '@/config/Environment';
import { FastifyBaseLogger } from 'fastify';

export function createGlobalConfigOptions(): ConfigModuleOptions {
	const options: ConfigModuleOptions = {
		isGlobal: true,
		cache: true,
		expandVariables: true,
		validate: validateEnvVariables,
	};

	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			options.ignoreEnvFile = true;
			break;

		case 'test':
		case 'development':
		default:
			options.ignoreEnvFile = false;
			options.envFilePath = '.env';
	}

	return options;
}

export function fastifyLogger(): Partial<FastifyBaseLogger | boolean> {
	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			return { level: 'info' };

		case 'test':
			return false;

		case 'development':
		default:
			return { level: 'debug' };
	}
}
