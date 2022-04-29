export function getDateRangeFormat(range: [Date, Date]) {
  const format = (date: Date): string =>
    `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  return `${format(range[0])}~${format(range[1])}`
}
