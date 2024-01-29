import { env } from 'node:process';
import { ConfigModuleOptions } from '@nestjs/config';
import { NodeEnv, validateEnvVariables } from '@/config/Environment';

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

export function logLevel() {
	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			return 'info';

		case 'test':
		case 'development':
		default:
			return 'debug';
	}
}
