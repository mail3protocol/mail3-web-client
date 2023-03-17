import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const formatDateString = (date: string | number | Date) => {
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

export const SubFormatDate = (
  date: string | number | Date,
  formatString: string = 'MMM D  h:mm A'
) => dayjs.unix(Number(date)).local().format(formatString)
