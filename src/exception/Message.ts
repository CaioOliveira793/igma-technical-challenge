export function uniqueConstraintViolationMessage(constraint: string) {
	return `ERROR: duplicate key violates unique constraint "${constraint}".`;
}
