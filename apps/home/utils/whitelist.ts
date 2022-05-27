import {
  IS_FORCE_WHITELIST,
  WHITE_LIST_APPLY_DATE_RANGE,
} from '../constants/env'

export function getDateRangeFormat(range: [Date, Date]) {
  const format = (date: Date): string =>
    `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  return `${format(range[0])}~${format(range[1])}`
}

export function isWhiteListStage() {
  if (IS_FORCE_WHITELIST) {
    return true
  }
  const now = new Date()
  return (
    now.getTime() >= WHITE_LIST_APPLY_DATE_RANGE[0].getTime() &&
    now.getTime() <= WHITE_LIST_APPLY_DATE_RANGE[1].getTime()
  )
}
