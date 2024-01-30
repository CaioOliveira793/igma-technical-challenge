import { formatCPF, isCPFdigitsValid, unformatCPF, isCPFvalid } from './cpf';

describe('CPF', () => {
	it('does not validate a CPF with invalid format', () => {
		const cpfs = [
			'790014.990-23',
			'790+014.990-23',
			'790.014-990-23',
			'790014=99023',
			'790/014=99023',
			'790.014.990/23',
			'790.014.990 23',
			' 790.014.990-23',
			'790.014.990-23 ',
		];

		for (const cpf of cpfs) {
			expect(isCPFvalid(cpf)).toBeFalsy();
		}
	});

	it('does not validate a invalid CPF formated', () => {
		const cpfs = [
			'577.998.400-15',
			'458.071.220-76',
			'610.749.140-74',
			'942.590.640-26',
			'762.777.180-90',
			'312.687.330-28',
			'826.714.670-94',
		];

		for (const cpf of cpfs) {
			expect(isCPFvalid(cpf)).toBeFalsy();
		}
	});

	it('does not validate a invalid CPF unformated', () => {
		const cpfs = [
			'57799840015',
			'45807122076',
			'61074914074',
			'94259064026',
			'76277718090',
			'31268733028',
			'05493288310',
		];

		for (const cpf of cpfs) {
			expect(isCPFvalid(cpf)).toBeFalsy();
		}
	});

	it('validate a unformated CPF', () => {
		const cpfs = [
			'49450542074',
			'56902745005',
			'16915709070',
			'61776056051',
			'19678380030',
			'13482431043',
		];

		for (const cpf of cpfs) {
			expect(isCPFvalid(cpf)).toBeTruthy();
		}
	});

	it('validate a formated CPF', () => {
		const cpfs = [
			'650.160.160-62',
			'554.175.590-59',
			'774.572.690-53',
			'067.230.620-43',
			'774.570.140-63',
			'150.336.770-39',
		];

		for (const cpf of cpfs) {
			expect(isCPFvalid(cpf)).toBeTruthy();
		}
	});

	it('unformat a correctly formated CPF', () => {
		const cpfs = [
			['000.000.000-00', '00000000000'],
			['123.456.789-01', '12345678901'],
			['xxx.xxx.xxx-xx', 'xxxxxxxxxxx'],
		];

		for (const [cpf, expected] of cpfs) {
			expect(unformatCPF(cpf)).toStrictEqual(expected);
		}
	});

	it('return null when unformat a CPF with invalid format', () => {
		const cpfs = [
			'000 000 000 00',
			'000.000-000.00',
			'000.000.000.00',
			'000+000+000-00',
			'000.000.000:00',
		];

		for (const cpf of cpfs) {
			expect(unformatCPF(cpf)).toStrictEqual(null);
		}
	});

	it('format a CPF with correct length', () => {
		const cpfs = [
			['00000000000', '000.000.000-00'],
			['12345678901', '123.456.789-01'],
			['xxxxxxxxxxx', 'xxx.xxx.xxx-xx'],
			['aaabbbcccdd', 'aaa.bbb.ccc-dd'],
		];

		for (const [cpf, expected] of cpfs) {
			expect(formatCPF(cpf)).toStrictEqual(expected);
		}
	});

	it('not format a CPF with incorrect length', () => {
		const cpfs = ['0000000000', '123456789', 'xxxxxxxxxxxxxxx'];

		for (const cpf of cpfs) {
			expect(formatCPF(cpf)).toStrictEqual(null);
		}
	});

	it('validate correct cpf digits', () => {
		const digitsList = [
			[4, 9, 4, 5, 0, 5, 4, 2, 0, 7, 4],
			[5, 6, 9, 0, 2, 7, 4, 5, 0, 0, 5],
			[1, 6, 9, 1, 5, 7, 0, 9, 0, 7, 0],
			[6, 1, 7, 7, 6, 0, 5, 6, 0, 5, 1],
			[1, 9, 6, 7, 8, 3, 8, 0, 0, 3, 0],
			[1, 3, 4, 8, 2, 4, 3, 1, 0, 4, 3],
		];

		for (const digits of digitsList) {
			expect(isCPFdigitsValid(digits)).toStrictEqual(true);
		}
	});

	it('not validate a cpf without 11 digits', () => {
		const digitsList = [
			[4, 9, 4, 5, 0, 5, 4, 2, 0],
			[5],
			[1, 6, 9, 1, 5, 7, 0, 9, 0, 7, 0, 1, 2, 5],
			[6, 1, 7, 7, 6, 0, 5, 6, 0, 5],
			[1, 9, 6, 7, 8, 3, 8, 0, 0, 3],
			[1, 3, 4, 8, 2, 4, 3, 1, 0, 4, 3, 0],
		];

		for (const digits of digitsList) {
			expect(isCPFdigitsValid(digits)).toStrictEqual(false);
		}
	});

	it('not validate cpf digits that is not between 0 and 9', () => {
		const digitsList = [
			[40, 9, 4, 52, 0, 5, 4, 2, 0, 75, 4],
			[15, 6, 9, 10, 2, 7, 4, 5, 0, 0, 5],
			[14, 6, 9, 10, 5, 7, 0, 9, 0, 7, 14],
			[6, 1, 777, 7, 6, 0, 5, 6, 0, 51, 1],
			[1, 98, 6, 7, 8, 3, 812, 0, 0, 3, 0],
		];

		for (const digits of digitsList) {
			expect(isCPFdigitsValid(digits)).toStrictEqual(false);
		}
	});
});
