import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const dynamicDateString = (date: string | number | Date) => {
  const thisYear = dayjs().year()
  const targetDayjs = dayjs(date)

  if (targetDayjs.isToday()) {
    return `${targetDayjs.format('h:mm a')}`
  }
  if (targetDayjs.isYesterday()) {
    return `Yesterday ${targetDayjs.format('h:mm a')}`
  }
  if (thisYear === targetDayjs.year()) {
    return targetDayjs.format('MMM D / h:mm a')
  }

  return targetDayjs.format('DD-MM-YYYY / h:mm a')
}
