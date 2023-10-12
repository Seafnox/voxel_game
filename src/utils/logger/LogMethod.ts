import { Level } from './Level'
import { LogAction } from './LogAction'
import { LogHelper } from './LogHelper'
import {getLogger} from "./CheckLogger";

// eslint-disable-next-line max-lines-per-function
export function LogMethod({ logType = [LogAction.exit, LogAction.exception], level = Level.debug }) {
	// eslint-disable-next-line max-lines-per-function
	return function (__target: NonNullable<unknown>, methodName: string, descriptor: PropertyDescriptor): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const target_method: (...args: unknown[]) => unknown = descriptor.value;

		// eslint-disable-next-line max-lines-per-function
		descriptor.value = function (...args: unknown[]): unknown {
			const logger = getLogger();
      const constructorName = this.constructor.name;

			if (logType.includes(LogAction.entry)) logger.log(level, `${constructorName}.${methodName}(${LogHelper.argumentsText(args)}) enter`)

			try {
				const result = target_method.apply(this, args)
				if (logType.includes(LogAction.exit))
					logger.log(level, `${constructorName}.${methodName}(${LogHelper.argumentsText(args)}) exit (${LogHelper.argumentsText(result)})`)

				return result
			} catch (problem) {
				if (logType.includes(LogAction.exception)) {
					if (logger.isLevelEnabled(Level.error)) {
						const problem_text = LogHelper.argumentsText(problem, LogHelper.maxErrorTextLength)
						const arg_text = LogHelper.argumentsText(args)
						const exception_text = `${constructorName}.${methodName}(${arg_text}) exception:(${problem_text}) stack:${(problem as Error).stack}`
						logger.error(exception_text)
					}
				}
				throw problem
			}
		}
	}
}
