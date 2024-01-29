import typescript from '@rollup/plugin-typescript';
import { default as packageJson } from './package.json' assert { type: 'json' };

/** @type {import('rollup').RollupOptions} */
const buildOptions = {
	input: packageJson.source,
	plugins: [
		typescript({
			include: ['src/**/*.ts'],
		}),
	],
	output: {
		file: packageJson.module,
		sourcemap: true,
		format: 'es',
	},
};

export default buildOptions;
