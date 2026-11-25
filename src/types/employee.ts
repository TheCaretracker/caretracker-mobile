import { RecurringEvent } from './schedule'
import { User } from './user'

export interface EmployeeDetails extends User {
  recurringEvents: RecurringEvent[]
  employmentLink: string
  employmentLinkStatus: string
}
