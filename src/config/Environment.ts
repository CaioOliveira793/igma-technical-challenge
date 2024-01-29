import { default as z } from 'zod';
import { InvalidTypeMessage, RequiredValueMessage } from '@/exception/Message';

export type NodeEnv = 'development' | 'test' | 'production';

export interface EnvVariables {
	/**
	 * Current NodeJS runtime enviornment
	 */
	NODE_ENV: NodeEnv;
	/**
	 * Service port listening the incoming connections.
	 */
	PORT: number;
	/**
	 * Database connection string
	 */
	DATABASE_URL: string;
}

const EnvVariablesSchema = z
	.object({
		PORT: z
			.number({
				invalid_type_error: InvalidTypeMessage,
				required_error: RequiredValueMessage,
				coerce: true,
			})
			.int({ message: 'PORT environment must be a integer' }),
		NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
		DATABASE_URL: z
			.string()
			.url({ message: 'DATABASE_URL environment must be a postgresql connection string' }),
	})
	.passthrough();

export function validateEnvVariables(env: Record<string, unknown>): EnvVariables {
	return EnvVariablesSchema.parse(env);
}
