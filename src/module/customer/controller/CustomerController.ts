import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import { NotFoundError } from '@/exception/resource/NotFoundError';
import { UlidSchema } from '@/module/shared/Schema';
import { QueryResult, makeQueryResult } from '@/module/shared/Resource';
import { CreateCustomerData } from '@/module/customer/entity/Customer';
import {
	CPFSchema,
	CreateCustomerSchema,
	CustomerQueryParamsSchema,
} from '@/module/customer/validation/Schema';
import {
	CUSTOMER_REPOSITORY_PROVIDER,
	CustomerRepository,
} from '@/module/customer/service/CustomerRepository';
import {
	CUSTOMER_RESOURCE_NAME,
	CustomerQueryParams,
	CustomerResource,
	makeCustomerResource,
} from '@/module/customer/dto/Resource';
import { CreateCustomerUseCase } from '@/module/customer/usecase/CreateCustomerUseCase';
import { ValidationUsage } from '@/exception/validation/ValidationError';

@Controller()
export class CustomerController {
	constructor(
		private readonly createCustomer: CreateCustomerUseCase,
		@Inject(CUSTOMER_REPOSITORY_PROVIDER)
		private readonly customerRepository: CustomerRepository
	) {}

	/**
	 * Creates a new customer from a valid customer creation data.
	 *
	 * @param data customer creation data
	 * @returns a new customer resource
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async create(
		@Body(new SchemaPipe(CreateCustomerSchema, ValidationUsage.Entity)) data: CreateCustomerData
	): Promise<CustomerResource> {
		const customer = await this.createCustomer.execute(data);
		return makeCustomerResource(customer);
	}

	/**
	 * Query customers by name.
	 *
	 * @param params customer query params
	 * @returns query result of customers
	 */
	@Get()
	@HttpCode(HttpStatus.OK)
	public async list(
		@Query(new SchemaPipe(CustomerQueryParamsSchema))
		params: CustomerQueryParams
	): Promise<QueryResult<CustomerResource>> {
		const list = await this.customerRepository.query(params);
		return makeQueryResult(list, params);
	}

	/**
	 * Finds a customer by ID.
	 *
	 * @param id entity id
	 * @returns customer resource found
	 */
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	public async get(@Param('id', new SchemaPipe(UlidSchema)) id: string): Promise<CustomerResource> {
		const customer = await this.customerRepository.find(id);
		if (!customer) {
			throw new NotFoundError({
				path: null,
				resource_type: CUSTOMER_RESOURCE_NAME,
				resource_key: 'id:' + id,
			});
		}

		return makeCustomerResource(customer);
	}

	/**
	 * Finds a customer by CPF.
	 *
	 * @param cpf customer cpf
	 * @returns customer resource found
	 */
	@Get('by_cpf/:cpf')
	@HttpCode(HttpStatus.OK)
	public async getByCPF(
		@Param('cpf', new SchemaPipe(CPFSchema)) cpf: string
	): Promise<CustomerResource> {
		const customer = await this.customerRepository.findByCPF(cpf);
		if (!customer) {
			throw new NotFoundError({
				path: null,
				resource_type: CUSTOMER_RESOURCE_NAME,
				resource_key: 'cpf:' + cpf,
			});
		}

		return makeCustomerResource(customer);
	}
}
