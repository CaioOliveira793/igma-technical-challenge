# Igma technical challenge

Solução para o desafio técnico.

## Tecnologias utilizadas

O projeto foi escrito em Typescript, seguindo o estilo do Clean Architecture.

Estas são algumas das techs usadas.

- framework [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Zod](https://zod.dev/) para validações
- [Jest](https://jestjs.io/) como test runner
- [Faker](https://fakerjs.dev/) para geração de dados fictícios
- [ProsgreSQL](https://www.postgresql.org/) como banco de dados

## Como executar

Para executar a API, certifique de estar executando uma instância do postgres em `DATABASE_URL` com todas as migrações mais recentes aplicadas, executando `pnpm run db:migrate`.

Com o banco preparado, inicie o serviço da API com `pnpm run start:dev` para utilizar o live reload em modo de desenvolvimento.

O arquivo `.env` deve garantir que todas as variáveis de ambiente sejam providas, sem a necessidade de passar manualmente.

### Containers

Utilizado uma ferramenta de gerenciamento de containers como `docker` ou `podman` é possível executar todos os serviços do backend com `docker-compose up` ou `podman-compose up`.

Os containers devem estar disponíveis em:

- `challenge_server` http://localhost:3333
- `postgres_db` postgresql://localhost:5432

## Como usar

A API pode ser consumida pelo seu cliente HTTP favorito (Postman, Insomnia, curl) seguindo a documentação dos [endpoints da API](#endpoints).

## Endpoints

Abra a documentação da API usando `pnpm run docs:open` para visualizar a documentação com o **Swagger (OpenAPI)**. Caso o serviço esteja em execução com suas configurações padrão, será possível usar a API através da interface.

- `POST /customer` Cria cliente com CPF, nome e data de nascimento
- `GET  /customer/:id` Lê um cliente pelo ID
- `GET  /customer/by_cpf/:cpf` Lê um cliente pelo CPF
- `GET  /customer` Consulta uma lista de clientes

## Build

Para fazer a build da API, execute `pnpm run build` para gerar os arquivos no diretório `build`.

## Testes

Antes de executar os testes, garanta que todos os pacotes estejam instalados com executando `pnpm install`.

Execute `pnpm run test` ou `pnpm run test:cov` para verificar a cobertura (coverage) dos testes.

### End to end

Para executar os testes e2e é necessário uma instância do postgres disponível em `DATABASE_URL` com todas as migrações aplicadas (`pnpm run db:migrate`).

Com o banco de dados online, execute os testes com `pnpm run test:e2e` ou `pnpm run test:e2e:cov` para verificar a cobertura.

## Troubleshooting

- A versão mínima do **NodeJS** é **20.11.0**.
- A versão mínima do **Postgres** é **16**.
- Para instalar o **pnpm** vá em [pnpm installation](https://pnpm.io/installation) e siga as instruções para o seu sistema.

## Licença

[MIT License](./LICENSE)