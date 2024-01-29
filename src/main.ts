import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ShutdownSignal } from '@nestjs/common';
import { EnvVariables } from '@/config/Environment';
import { AppModule } from '@/module/App';
import { fastifyInstance } from '@/FastifyInstance';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(fastifyInstance()),
		{ bodyParser: false }
	);

	const config = app.get<ConfigService<EnvVariables, true>>(ConfigService);
	const port = config.get<number>('PORT');

	app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

	await app.listen(port, '0.0.0.0');
}

await bootstrap();
