import { Level, LevelFromText } from './Level'
import { Logger } from './Logger'

export class Logging {
	static cliSettings: Record<string, string> = {}

	private static envSettings: Record<string, string>;

	private static getEnvironmentSpecifiedLevel(name: string): string | undefined {
		if (!Logging.envSettings) {
			Logging.envSettings = {};
		}

		if (Logging.envSettings[name]) {
			return Logging.envSettings[name];
		}

    return
	}

	static newLogger(name: string): Logger {
		let level

		if (typeof name !== 'string' || name === 'Function') throw new RangeError(`Bad name provided for logger, its not a string`)

		// cli specified log level
		if (Logging.cliSettings[name]) level = LevelFromText(Logging.cliSettings[name])

		// environment specified log level
		if (!level) level = LevelFromText(this.getEnvironmentSpecifiedLevel(name))

		return new Logger(name, level)
	}
}
