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
import { ConflictError } from '@/exception/resource/ConflictError';
import { NotFoundError } from '@/exception/resource/NotFoundError';
import { UlidSchema } from '@/module/shared/Schema';
import { QueryResult, makeQueryResult } from '@/module/shared/Resource';
import { CreateCustomerData, Customer } from '@/module/customer/entity/Customer';
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

@Controller()
export class CustomerController {
	constructor(
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
		@Body(new SchemaPipe(CreateCustomerSchema)) data: CreateCustomerData
	): Promise<CustomerResource> {
		const customerFound = await this.customerRepository.findByCPF(data.cpf);
		if (customerFound) {
			throw new ConflictError({
				path: 'cpf',
				resource_type: CUSTOMER_RESOURCE_NAME,
				resource_key: 'cpf:' + data.cpf,
			});
		}

		const customer = Customer.create(data);
		await this.customerRepository.insert(customer);

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
		@Query(new SchemaPipe(CustomerQueryParamsSchema)) params: CustomerQueryParams
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
