import { exit as exitProcess } from 'node:process';
import { PrismaClient } from '@prisma/client';

const DATABASE_TABLES = ['customer'];

const prisma = new PrismaClient();

(async () => {
	try {
		await prisma.$connect();
	} catch (err: unknown) {
		console.error(
			'An error occurred while connecting to the database\n' +
				'To run the e2e test ensure that the database is up, migrated,' +
				' and accessible through the DATABASE_URL environment variable.'
		);
		console.error(err);
		exitProcess(-1);
	}
})();

export async function databaseSetup(): Promise<void> {
	const sqlCommand = 'TRUNCATE TABLE ' + DATABASE_TABLES.join(', ') + ' CASCADE';

	try {
		await prisma.$executeRawUnsafe(sqlCommand);
	} catch (err: unknown) {
		console.error('An error occurred while cleanning the database for the next test', err);
	}
}
