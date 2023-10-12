import { Level, LEVEL_TEXT } from './Level'

/**
 * Very simple logger.
 */
export class Logger {
	name: string

	level: Level

	constructor(name: string, level?: Level) {
		this.name = name
		this.level = level ? level : Level.info
	}

	isLevelEnabled(checkLevel: Level): boolean {
		return this.level <= checkLevel
	}

	log(level: Level, message: string): void {
		if (this.level == level) this.write(level, message)
	}

	trace(message: string): void {
		if (this.level == Level.trace) this.write(this.level, message)
	}

	debug(message: string): void {
		if (this.level <= Level.debug) this.write(this.level, message)
	}

	info(message: string): void {
		if (this.level <= Level.info) this.write(this.level, message)
	}

	warn(message: string): void {
		if (this.level <= Level.warn) this.write(this.level, message)
	}

	error(message: string): void {
		if (this.level <= Level.error) this.write(this.level, message)
	}

	fatal(message: string): void {
		if (this.level <= Level.fatal) this.write(this.level, message)
	}

	write(messageLevel: Level, message: string): void {
		console.log(`{"level":"${LEVEL_TEXT[messageLevel]}","name":"${this.name}","message":"${message}"`)
	}
}
