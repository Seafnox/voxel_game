export function CircularReplacer<T>(): (__key: string, value: T) => T | undefined {
	const seen = new WeakSet()
	return (__key: string, value: T): T | undefined => {
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
				return
			}
			seen.add(value)
		}
		return value
	}
}
