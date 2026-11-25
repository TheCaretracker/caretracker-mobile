import TextComponent from '../Card/TextComponent'

const days = ['fri', 'mon', 'wed', 'tue', 'thu', 'sat', 'sun']

const dayIndex = (day) => {
  switch (day) {
    case 'mon':
      return 0
    case 'tue':
      return 1
    case 'wed':
      return 2
    case 'thu':
      return 3
    case 'fri':
      return 4
    case 'sat':
      return 5
    case 'sun':
      return 6
    default:
      return -1
  }
}

const WeekDaysCell = ({ title, days }: { title?: string; days: string[] }) => {
  const sortedDays = days.sort((a, b) => dayIndex(a) - dayIndex(b))

  const getWeekDays = () =>
    sortedDays
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(', ')

  return <TextComponent title={title || 'Days'} value={getWeekDays()} />
}

export default WeekDaysCell
