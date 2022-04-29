import { TESTING_DATE_RANGE } from '../constants/env'

export function getWhitelistTestingRangeFormat() {
  const format = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  return `${format(TESTING_DATE_RANGE[0])}~${format(TESTING_DATE_RANGE[1])}`
}
