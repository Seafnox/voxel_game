import { Level } from './Level'
import { LogAction } from './LogAction'
import { LogHelper } from './LogHelper'
import {getLogger} from "./CheckLogger";

// eslint-disable-next-line max-lines-per-function
export function LogAsyncMethod({ logType = [LogAction.exit, LogAction.exception], level = Level.debug }) {
	// eslint-disable-next-line max-lines-per-function
	return function (__target: NonNullable<unknown>, methodName: string, descriptor: PropertyDescriptor): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const target_method: (...args: undefined[]) => unknown = descriptor.value
		// eslint-disable-next-line max-lines-per-function
		descriptor.value = async function (...args: undefined[]): Promise<unknown> {
			const logger = getLogger();
      const constructorName = this.constructor.name;

			let arg_text
			if (logType.includes(LogAction.entry)) {
				arg_text = await LogHelper.argumentsTextAsync(args)
				logger.log(level, `${constructorName}.${methodName}(${arg_text}) enter`)
			}

			try {
				const result = await target_method.apply(this, args)
				if (logType.includes(LogAction.exit)) {
					const result_text = await LogHelper.argumentsTextAsync(result)
					arg_text = arg_text ? arg_text : await LogHelper.argumentsTextAsync(args)
					logger.log(level, `${constructorName}.${methodName}(${arg_text}) exit (${result_text})`)
				}

				return result
			} catch (problem) {
				if (logType.includes(LogAction.exception)) {
					if (logger.isLevelEnabled(Level.error)) {
						const problem_text = await LogHelper.argumentsTextAsync(problem, LogHelper.maxErrorTextLength)
						arg_text = arg_text ? arg_text : await LogHelper.argumentsTextAsync(args)
						const exception_text = `${constructorName}.${methodName}(${arg_text}) exception:(${problem_text}) stack:${(problem as Error).stack}`
						logger.error(exception_text)
					}
				}
				throw problem
			}
		}
	}
}
