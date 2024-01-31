import { PrismaClient, Customer as CustomerTuple } from '@prisma/client';
import { Inject, Injectable, Provider } from '@nestjs/common';
import { PRISMA_SERVICE_PROVIDER, PrismaService } from '@/module/shared/service/PrismaService';
import { Customer } from '@/module/customer/entity/Customer';
import { CustomerQueryParams, CustomerResource } from '@/module/customer/dto/Resource';
import {
	CUSTOMER_REPOSITORY_PROVIDER,
	CustomerRepository,
} from '@/module/customer/service/CustomerRepository';

function mapTupleToCustomerEntity(tuple: CustomerTuple): Customer {
	return Customer.restore(tuple.id, {
		created: tuple.created,
		cpf: tuple.cpf,
		name: tuple.name,
		birthdate: tuple.birthdate,
	});
}

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
	public constructor(
		@Inject(PRISMA_SERVICE_PROVIDER)
		prismaService: PrismaService
	) {
		this.prisma = prismaService.prisma;
	}

	public async insert(customer: Customer): Promise<void> {
		await this.prisma.customer.create({
			data: {
				id: customer.id,
				created: customer.created,
				cpf: customer.cpf,
				name: customer.name,
				birthdate: customer.birthdate,
			},
		});
	}

	public async find(id: string): Promise<Customer | null> {
		const tuple = await this.prisma.customer.findUnique({
			where: { id },
		});

		if (!tuple) return null;

		return mapTupleToCustomerEntity(tuple);
	}

	public async findByCPF(cpf: string): Promise<Customer | null> {
		const tuple = await this.prisma.customer.findUnique({
			where: { cpf },
		});

		if (!tuple) return null;

		return mapTupleToCustomerEntity(tuple);
	}

	public async query(params: CustomerQueryParams): Promise<Array<CustomerResource>> {
		const tuples = await this.prisma.customer.findMany({
			where: {
				name: params.name ? { contains: params.name } : undefined,
			},
			// Since the id is lexicographically sortable and has the creation timestamp
			// in the most significant part, sorting by the id will produce the same order
			// as sorting by the created field, with the benefit that it will use the id index.
			orderBy: { id: 'desc' },
			skip: params.offset,
			take: params.limit,
		});

		return tuples;
	}

	private readonly prisma: PrismaClient;
}

export const CustomerPrismaRepositoryProvider: Provider<CustomerRepository> = {
	provide: CUSTOMER_REPOSITORY_PROVIDER,
	useClass: CustomerPrismaRepository,
};
