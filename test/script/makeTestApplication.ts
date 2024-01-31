import { Test } from '@nestjs/testing';
import { fastifyInstance } from '@/FastifyInstance';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '@/module/App';

export async function makeTestApplication(): Promise<NestFastifyApplication> {
	const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
	const app = moduleRef.createNestApplication<NestFastifyApplication>(
		new FastifyAdapter(fastifyInstance()),
		{ bodyParser: false }
	);
	await app.init();
	await app.getHttpAdapter().getInstance().ready();
	return app;
}
