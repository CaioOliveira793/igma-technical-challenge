import { APP_FILTER, RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { HttpExceptionFilter } from '@/exception/HttpExceptionFilter';
import { CustomerModule } from '@/module/customer/CustomerModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		CustomerModule,
		RouterModule.register([{ path: 'customer', module: CustomerModule }]),
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
