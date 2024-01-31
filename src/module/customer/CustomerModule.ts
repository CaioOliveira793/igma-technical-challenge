import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/shared/SharedModule';
import { CustomerController } from '@/module/customer/controller/CustomerController';
import { CustomerPrismaRepositoryProvider } from '@/module/customer/service/impl/CustomerPrismaRepository';

@Module({
	imports: [SharedModule],
	providers: [CustomerPrismaRepositoryProvider],
	controllers: [CustomerController],
})
export class CustomerModule {}
