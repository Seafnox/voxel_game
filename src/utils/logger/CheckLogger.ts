import {Logging} from "./Logging";
import {Logger} from "./Logger";

const loggerLink = Symbol('Logger');

export function checkLogger() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!window[loggerLink]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window[loggerLink] = Logging.newLogger('global');
  }
}

export function getLogger(): Logger {
  checkLogger();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return window[loggerLink];
}
