import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const SubFormatDate = (
  date: string | number | Date,
  formatString: string = 'MMM D  h:mm A'
) => dayjs.unix(Number(date)).local().format(formatString)
