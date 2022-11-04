import dayjs from 'dayjs'

export function isNextDay(time: string | number | dayjs.Dayjs) {
  const currentTime =
    typeof time === 'string' || typeof time === 'number' ? dayjs(time) : time
  const now = dayjs()
  if (!now.isAfter(currentTime)) {
    return false
  }
  if (now.year() < currentTime.year()) {
    return false
  }
  if (now.year() > currentTime.year()) {
    return true
  }
  if (now.month() < currentTime.month()) {
    return false
  }
  if (now.month() > currentTime.month()) {
    return true
  }
  if (now.date() <= currentTime.date()) {
    return false
  }
  return true
}
