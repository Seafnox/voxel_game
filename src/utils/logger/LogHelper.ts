import { CircularReplacer } from './CircularReplacer'
import {isPromise} from "../isPromise";

export class LogHelper {
	static maxArgumentLength = 1024

	static maxErrorTextLength = 2056

	static argumentText(argumentToTranslate: unknown, maxLength = this.maxArgumentLength): string {
		// is the arg a promise? if so resolve its value
		let full_arg_text: string = argumentToTranslate
			? typeof argumentToTranslate === 'object'
				? JSON.stringify(argumentToTranslate, CircularReplacer())
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
				: argumentToTranslate.toString()
			: 'undefined'
		if (full_arg_text.length > maxLength) full_arg_text = `${full_arg_text.substring(0, maxLength)}...`

		return full_arg_text
	}

	static async argumentTextAsync(arg: unknown, maxLength = this.maxArgumentLength): Promise<string> {
		return this.argumentText(isPromise(arg) ? await arg : arg, maxLength)
	}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	static argumentsText(args: unknown | unknown[], maxLength = this.maxArgumentLength): string {
		if (!args) return ''
		if (!Array.isArray(args)) return this.argumentText(args, maxLength)

		let arg_text = ''
		args.forEach((arg) => {
			if (arg_text != '') arg_text += ', '

			arg_text += this.argumentText(arg, maxLength)
		})
		if (arg_text.length > maxLength) arg_text = `${arg_text.substring(0, maxLength)}...`

		return arg_text
	}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	static async argumentsTextAsync(args: unknown | unknown[], maxLength = this.maxArgumentLength): Promise<string> {
		if (!args) return ''

		if (!Array.isArray(args)) return this.argumentTextAsync(args, maxLength)

		let arg_text = '';
    const argSize = args.length;
		for (let index = 0; index < argSize; index++) {
      const arg: unknown = args[index];
			if (arg_text != '') arg_text += ', '

			arg_text += await this.argumentTextAsync(arg, maxLength)
		}
		if (arg_text.length > maxLength) arg_text = `${arg_text.substring(0, maxLength)}...`

		return arg_text
	}
}
