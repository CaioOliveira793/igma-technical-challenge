export const CPF_FORMATTED_LENGTH = 14;
export const CPF_UNFORMATTED_LENGTH = 11;

/**
 * Unformat a CPF string.
 *
 * @param cpf CPF string
 * @returns a unformatted CPF or null if the CPF is invalid
 */
export function unformatCPF(cpf: string): string | null {
	if (cpf.length === CPF_UNFORMATTED_LENGTH) return cpf;

	if (cpf.length !== CPF_FORMATTED_LENGTH) return null;

	// Verify if the correct mask characters are in the CPF
	if (cpf[3] === '.' && cpf[7] === '.' && cpf[11] === '-') {
		return cpf.slice(0, 3) + cpf.slice(4, 7) + cpf.slice(8, 11) + cpf.slice(12, 14);
	}

	return null;
}

/**
 * Format a CPF string (`000.000.000-00`).
 *
 * @param cpf CPF string
 * @returns a formatted CPF or null if the CPF is innvalid
 */
export function formatCPF(cpf: string): string | null {
	if (cpf.length === CPF_FORMATTED_LENGTH) return cpf;

	if (cpf.length !== CPF_UNFORMATTED_LENGTH) return null;

	return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9, 11);
}

/**
 * Parse a unformatted CPF into a list of 11 digits.
 *
 * @param unformattedCPF unformated CPF
 * @returns a array with 11 digits
 */
export function parseUnformattedCPF(unformattedCPF: string): Array<number> | null {
	if (unformattedCPF.length !== CPF_UNFORMATTED_LENGTH) return null;

	const digits: Array<number> = [];
	for (const char of unformattedCPF) {
		const digit = Number.parseInt(char);
		if (digit > 9 || digit < 0) return null;
		digits.push(digit);
	}

	return digits;
}

/**
 * Validates if a list of CPF digits is valid.
 *
 * @param digits a array of 11 digits from 0 to 9
 * @returns true if the CPF has valid digits
 */
export function isCPFdigitsValid(digits: Array<number>): boolean {
	// A valid CPF must have 11 digits
	if (digits.length !== CPF_UNFORMATTED_LENGTH) return false;

	// All digits of a valid CPF must be from 0 to 9
	for (const digit of digits) {
		if (digit > 9 || digit < 0) return false;
	}

	let firstSum = 0;
	for (let i = 1; i < 10; i++) {
		firstSum += digits[i - 1] * (11 - i);
	}

	let firstRest = (firstSum * 10) % 11;
	if (firstRest == 10 || firstRest == 11) {
		firstRest = 0;
	}
	if (firstRest != digits[9]) {
		return false;
	}

	let secondSum = 0;
	for (let i = 1; i < 11; i++) {
		secondSum += digits[i - 1] * (12 - i);
	}

	let secondRest = (secondSum * 10) % 11;
	if (secondRest == 10 || secondRest == 11) {
		secondRest = 0;
	}
	if (secondRest != digits[10]) {
		return false;
	}

	return true;
}

/**
 * Validates if the CPF is valid.
 *
 * @param cpf CPF string
 * @returns true if the CPF is valid
 */
export function isCPFvalid(cpf: string): boolean {
	const unformattedCPF = unformatCPF(cpf);
	if (unformattedCPF === null) return false;

	const digits = parseUnformattedCPF(unformattedCPF);
	if (digits === null) return false;

	return isCPFdigitsValid(digits);
}
