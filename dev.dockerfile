FROM docker.io/library/node:20.11-bullseye-slim as development

WORKDIR /home/node

ENV NODE_ENV=development

RUN corepack enable pnpm
RUN alias pnpm='corepack pnpm'

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --include=prod --include=dev --ignore-scripts

COPY ./ ./

CMD pnpm run db:migrate && pnpm run start:dev
