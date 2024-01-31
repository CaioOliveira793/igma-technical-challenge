import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/shared/SharedModule';
import { CustomerController } from '@/module/customer/controller/CustomerController';
import { CustomerPrismaRepositoryProvider } from '@/module/customer/service/impl/CustomerPrismaRepository';
import { CreateCustomerUseCase } from '@/module/customer/usecase/CreateCustomerUseCase';

@Module({
	imports: [SharedModule],
	providers: [CustomerPrismaRepositoryProvider, CreateCustomerUseCase],
	controllers: [CustomerController],
})
export class CustomerModule {}
