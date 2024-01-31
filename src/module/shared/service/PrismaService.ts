import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Provider, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { EnvVariables, NodeEnv } from '@/config/Environment';

@Injectable()
export class PrismaService implements OnApplicationShutdown {
	public readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	onApplicationShutdown(): Promise<void> {
		return this.prisma.$disconnect();
	}
}

function instantiatePrismaClient(env: NodeEnv, datasourceUrl: string): PrismaClient {
	switch (env) {
		case 'production':
			return new PrismaClient({ datasourceUrl, log: ['warn', 'error'] });

		default:
			return new PrismaClient({
				datasourceUrl,
				log: ['query', 'info', 'warn', 'error'],
			});
	}
}

function prismaServiceFactory(config: ConfigService<EnvVariables, true>): PrismaService {
	const prisma = instantiatePrismaClient(
		config.get<NodeEnv>('NODE_ENV'),
		config.get<string>('DATABASE_URL')
	);
	return new PrismaService(prisma);
}

export const PRISMA_SERVICE_PROVIDER = 'SHARED/PRISMA_SERVICE_PROVIDER';

export const PrismaServiceProvider: Provider<PrismaService> = {
	provide: PRISMA_SERVICE_PROVIDER,
	useFactory: prismaServiceFactory,
	inject: [ConfigService],
};
