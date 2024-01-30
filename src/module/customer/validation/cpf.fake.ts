import { faker } from '@faker-js/faker';
import { formatCPF } from '@/module/customer/validation/cpf';

/**
 * Generates a valid unformatted CPF.
 *
 * @returns unformatted CPF
 */
export function fakeCPF(): string {
	const size = 9;
	const digits = Array.from(Array(size), () => faker.number.int({ min: 0, max: 9 }));

	let d1 =
		digits[8] * 2 +
		digits[7] * 3 +
		digits[6] * 4 +
		digits[5] * 5 +
		digits[4] * 6 +
		digits[3] * 7 +
		digits[2] * 8 +
		digits[1] * 9 +
		digits[0] * 10;

	d1 = 11 - (d1 % 11);
	if (d1 >= 10) d1 = 0;

	let d2 =
		d1 * 2 +
		digits[8] * 3 +
		digits[7] * 4 +
		digits[6] * 5 +
		digits[5] * 6 +
		digits[4] * 7 +
		digits[3] * 8 +
		digits[2] * 9 +
		digits[1] * 10 +
		digits[0] * 11;

	d2 = 11 - (d2 % 11);
	if (d2 >= 10) d2 = 0;

	return digits.join('') + d1.toString() + d2.toString();
}

/**
 * Generates a valid formatted CPF.
 *
 * @returns a formated CPF
 */
export function fakeFormattedCPF(): string {
	return formatCPF(fakeCPF()) as string;
}
