import moment from 'moment'
import { ListFormatter } from './formatters'
import { WeekDay } from '@/types/weekDay'

export const repeatString = (data) => {
  console.log(data)
  const formatter = new ListFormatter()
  switch (data.repeat) {
    case 'daily':
      return `Repeats every day${
        data.includeWeekends ? ', including weekends' : ''
      }`
    case 'weekly':
      const weekDay = moment(data.startDate).format('dddd')
      return `Repeats weekly on ${weekDay}`
    case 'monthly':
      return 'Repeats every month'
    case 'custom':
      const weekDays = data.customRepeat.map((weekDay) => {
        const dayIndex = Object.values(WeekDay).indexOf(weekDay)
        return moment().weekday(dayIndex).format('dddd')
      })
      return `Repeats every ${formatter.format(weekDays)}`
  }
}
