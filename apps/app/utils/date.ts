import dayjs from 'dayjs'

export const dynamicDateString = (date: string | number | Date) => {
  const now = dayjs()
  const thisYear = now.format('YYYY')
  const today = now.format('YYYY/MM/DD')
  const targetDayjs = dayjs(date)
  const targetYear = targetDayjs.format('YYYY')
  const targetDay = targetDayjs.format('YYYY/MM/DD')
  let dispalyString = ''

  if (thisYear !== targetYear) {
    dispalyString = targetDay
  } else if (today !== targetDay) {
    dispalyString = targetDayjs.format('MMM D')
  } else {
    dispalyString = targetDayjs.format('h:mma')
  }

  return dispalyString
}
