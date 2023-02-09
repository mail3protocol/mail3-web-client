import pino, { Logger } from 'pino'

export const enum LoggerLevel {
  Profile = 'profile',
  Page = 'page',
  Any = '*',
}

const logLevelData = {
  [LoggerLevel.Any]: 'silent',
  [LoggerLevel.Page]: 'error',
  [LoggerLevel.Profile]: 'error',
}

const logLevels = new Map<string, string>(Object.entries(logLevelData))

export function getLogLevel(logger: LoggerLevel): string {
  return logLevels.get(logger) || logLevels.get('*') || 'info'
}

export function getLogger(name: LoggerLevel): Logger {
  return pino({ name, level: getLogLevel(name) })
}
