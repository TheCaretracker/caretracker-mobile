export const hoursData = [
  { value: Math.random() * 12, label: 'Su' },
  { value: Math.random() * 12, label: 'Mo' },
  { value: Math.random() * 12, label: 'Tu' },
  { value: Math.random() * 12, label: 'We' },
  { value: Math.random() * 12, label: 'Th' },
  { value: Math.random() * 12, label: 'Fr' },
  { value: Math.random() * 12, label: 'Sa' },
]
export const rangeDateData = [
  { value: 4, date: '5 Sep 2023' },
  { value: 5, date: '6 Sep 2023', label: '6' },
  { value: 4, date: '7 Sep 2023' },
  { value: 5, date: '8 Sep 2023' },
  { value: 9, date: '9 Sep 2023' },
  { value: 12, date: '10 Sep 2023' },
  { value: 11, date: '11 Sep 2023' },
  { value: 5, date: '12 Sep 2023' },
  { value: 4, date: '13 Sep 2023' },
  { value: 6, date: '14 Sep 2023', label: '14' },
  { value: 6, date: '15 Sep 2023' },
  { value: 4, date: '16 Sep 2023' },
  { value: 4, date: '17 Sep 2023' },
  { value: 6, date: '18 Sep 2023' },
  { value: 10, date: '19 Sep 2023' },
  { value: 10, date: '20 Sep 2023' },
  { value: 7, date: '21 Sep 2023' },
  { value: 6, date: '22 Sep 2023' },
  { value: 5, date: '23 Sep 2023', label: '23' },
  { value: 5, date: '24 Sep 2023' },
]
export const markedDates = {
  '2023-09-06': {
    startingDay: true,
    color: '#bbd6f4',
    textColor: '#007bff',
  },
  '2023-09-07': { color: '#e4efff' },
  '2023-09-08': { color: '#e4efff' },
  '2023-09-09': { color: '#e4efff' },
  '2023-09-10': { color: '#e4efff' },
  '2023-09-11': { color: '#e4efff' },
  '2023-09-12': { color: '#e4efff' },
  '2023-09-13': { color: '#e4efff' },
  '2023-09-14': { color: '#e4efff' },
  '2023-09-15': { color: '#e4efff' },
  '2023-09-16': { color: '#e4efff' },
  '2023-09-17': { color: '#e4efff' },
  '2023-09-18': { color: '#e4efff' },
  '2023-09-19': { color: '#e4efff' },
  '2023-09-20': { color: '#e4efff' },
  '2023-09-21': { color: '#e4efff' },
  '2023-09-22': { color: '#e4efff' },
  '2023-09-23': {
    endingDay: true,
    color: '#bbd6f4',
    textColor: '#007bff',
  },
}

export const Employee = [
  {
    id: 2,
    name: 'Rachel Bowman',
    hoursData,
    rangeDateData
  },
  {
    id: 4,
    name: 'Kelly Ramirez',
    hoursData,
    rangeDateData
  },
  {
    id: 6,
    name: 'Emma Harrison',
    hoursData,
    rangeDateData
  },
  {
    id: 8,
    name: 'Jeff Lawson',
    hoursData,
    rangeDateData
  },
  {
    id: 10,
    name: 'Jon Doe',
    hoursData,
    rangeDateData
  },
]
