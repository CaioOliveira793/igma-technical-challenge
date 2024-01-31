import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/shared/SharedModule';
import { CustomerController } from '@/module/customer/controller/CustomerController';
import { CustomerMemRepositoryProvider } from '@/module/customer/service/impl/CustomerMemRepository';

@Module({
	imports: [SharedModule],
	providers: [CustomerMemRepositoryProvider],
	controllers: [CustomerController],
})
export class CustomerModule {}
