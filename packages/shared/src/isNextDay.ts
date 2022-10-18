import dayjs from 'dayjs'

export function isNextDay(time: string | number | dayjs.Dayjs) {
  const currentTime =
    typeof time === 'string' || typeof time === 'number' ? dayjs(time) : time
  return currentTime.date() < dayjs().date()
}
