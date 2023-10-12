import { Level, LevelFromText } from './Level'
import { Logger } from './Logger'

export class Logging {
	static cliSettings: Record<string, string> = {}

	private static envSettings: Record<string, string>;

	private static getEnvironmentSpecifiedLevel(name: string): string | undefined {
		if (!Logging.envSettings) {
			Logging.envSettings = {}
			try {
				if (process.env.LOG_LEVELS) {
					Logging.envSettings = JSON.parse(process.env.LOG_LEVELS) as Record<string, string>
				}
			} catch (problem) {
				console.log(
					`Unable to parse log levels (${process.env.LOG_LEVELS}). ${(problem as Error).toString()}. You may need to adjust quoting, use the example -l='{\\"ConfigurationManager\\":\\"debug\\", \\"hf\\":\\"debug\\"}'`
				)
			}
		}

		if (Logging.envSettings[name]) {
			return Logging.envSettings[name]
		}
		return process.env.LOG_LEVEL
	}

	static newLogger(name: string): Logger {
		let level

		if (typeof name !== 'string' || name === 'Function') throw new RangeError(`Bad name provided for logger, its not a string`)

		// cli specified log level
		if (Logging.cliSettings[name]) level = LevelFromText(Logging.cliSettings[name])

		// environment specified log level
		if (!level) level = LevelFromText(this.getEnvironmentSpecifiedLevel(name))

		// overall default = info
		if (!level) level = Level.info

		return new Logger(name, level)
	}
}
