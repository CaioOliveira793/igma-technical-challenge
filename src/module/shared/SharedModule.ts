import { Module } from '@nestjs/common';
import { PrismaServiceProvider } from './service/PrismaService';

@Module({
	providers: [PrismaServiceProvider],
	exports: [PrismaServiceProvider],
})
export class SharedModule {}
