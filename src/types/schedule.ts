import { WeekDay } from './weekDay'

export interface Schedule {
  id: string
  employerName: string
  employeeName: string
  startDate: Date
  startTime: string
  endTime: string
}

export type Repeat = 'onetime' | 'daily' | 'weekly' | 'monthly' | 'custom'

export interface RecurringEvent {
  id: string
  caregiverId: number
  startDate: string
  endDate?: string
  startTime: string
  endTime: string
  repeat: Repeat
  customRepeat: WeekDay[]
  status: string
  type: 'WorkEvent' | 'TimeOffRequest'
  includeWeekends: boolean
  exclude: WeekDay[]
  employerName?: string
}

export interface AddEditRecurringEvent extends Partial<RecurringEvent> {}
