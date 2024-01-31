export function removeStackTrace<T extends Error>(err: T): Omit<T, 'stack'> {
	delete err.stack;
	return err;
}
