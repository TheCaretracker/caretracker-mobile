import dayjs from 'dayjs'
import { generateDateRange } from '../helper'

export const getRangeMarkedDate = (start: string, end: string) => {
  const result = {}
  const range = generateDateRange(start, end)

  range.forEach((date) => {
    result[date] = {
      color: '#e4efff',
    }

    if (date === start || date === end) {
      const updatedDate = result[date]
      updatedDate.startingDay = date === start
      updatedDate.endingDay = date === end
      updatedDate.color = '#bbd6f4'
      updatedDate.textColor = '#007bff'
    }
  })

  return result
}

export const getYears = () => {
  const yearsAheadOfTime = 1
  const yearsBeforeTime = 20
  let result = []

  for (
    let i = dayjs().year() + yearsAheadOfTime;
    i > dayjs().year() - yearsBeforeTime;
    i--
  ) {
    result.push(i)
  }
  return result
}

export const YEARS = getYears()
