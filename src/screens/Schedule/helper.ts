export const buildCalendarObject = (
  data: { [s: string]: any },
  dotMarkings: { color: string; key: string }[]
) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    const day = parseInt(key.split('-')[2])
    acc[key] = populateScheduleColors(day, value, dotMarkings)
    acc[key]['dots'] = acc[key]
      .filter((item) => item.status !== 'declined')
      .map((item) => item.marking)
    return acc
  }, {})
}

// pick random colors from a pool and refills it
// when the entries are bigger than the number of colors used
const populateScheduleColors = (
  day: number,
  schedule: any[],
  dotMarkings: { color: string; key: string }[]
) => {
  const totalMarkings = dotMarkings.length

  return schedule.map((entry, index) => {
    const markingIndex = (day + index) % totalMarkings
    const marking = dotMarkings[markingIndex]
    return { ...entry, marking: marking }
  })
}
