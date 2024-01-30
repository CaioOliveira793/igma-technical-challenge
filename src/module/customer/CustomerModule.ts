import { Module } from '@nestjs/common';
import { CustomerController } from '@/module/customer/controller/CustomerController';
import { CustomerMemRepositoryProvider } from '@/module/customer/service/impl/CustomerMemRepository';

@Module({
	imports: [],
	providers: [CustomerMemRepositoryProvider],
	controllers: [CustomerController],
	exports: [],
})
export class CustomerModule {}
